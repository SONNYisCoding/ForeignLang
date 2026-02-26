package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.entity.UsageQuota;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.repository.UsageQuotaRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import com.foreignlang.backend.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import com.foreignlang.backend.security.JwtTokenProvider;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthRESTController {

    private final UserRepository userRepository;
    private final UsageQuotaRepository usageQuotaRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    // DTO for registration
    public record RegisterRequest(
            String email,
            String password,
            String fullName) {
    }

    // DTO for login
    public record LoginRequest(
            String email,
            String password) {
    }

    // DTO for profile setup (Google users)
    public record ProfileSetupRequest(
            String username,
            String fullName,
            LocalDate birthDate) {
    }

    public record ForgotPasswordRequest(String email) {
    }

    public record ResetPasswordRequest(String token, String newPassword) {
    }

    @PostMapping("/register")
    @org.springframework.transaction.annotation.Transactional // Ensure atomic save of User + Quota
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        log.info("Registration attempt for email: {}", request.email());

        // Validate inputs
        if (request.email() == null || request.email().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        if (request.password() == null || request.password().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
        }

        // Validate email not taken
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Email already registered",
                    "code", "EMAIL_EXISTS"));
        }

        // Create new user
        String encodedPassword = passwordEncoder.encode(request.password());
        log.info("Generating hash for new user. Raw pwd length: {}, Hash length: {}", request.password().length(),
                encodedPassword.length());

        User user = User.builder()
                .email(request.email())
                .passwordHash(encodedPassword)
                .fullName(request.fullName() != null ? request.fullName() : "User")
                .roles(new java.util.HashSet<>(java.util.Set.of(User.Role.LEARNER)))
                .authProvider(User.AuthProvider.LOCAL)
                .profileComplete(false)
                .subscriptionTier(User.SubscriptionTier.FREE)
                .build();

        user = userRepository.save(user);
        log.info("User created with ID: {}", user.getId());

        // Create usage quota with 5 bonus uses
        try {
            UsageQuota quota = UsageQuota.createForNewUser(user);
            usageQuotaRepository.save(quota);
            log.info("Usage quota created for user: {}", user.getId());
        } catch (Exception e) {
            log.error("Failed to create usage quota: {}", e.getMessage());
            throw e; // Will trigger rollback
        }

        // Removed stateful session auto-login logic

        // Generate Token immediately for auto-login
        String token = jwtTokenProvider.generateTokenFromEmail(user.getEmail());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Registration successful! You have 5 free AI uses.",
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "fullName", user.getFullName(),
                        "roles", user.getRoles().stream().map(Enum::name).collect(java.util.stream.Collectors.toList()),
                        "tier", user.getSubscriptionTier().name(),
                        "profileComplete", user.isProfileComplete())));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        log.info("Login attempt for email: {}", request.email());

        // Use AuthenticationManager to authenticate. Any failure will be intercepted by
        // GlobalExceptionHandler
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        // Set authentication in SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get User details
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userPrincipal.getUser();

        // Generate JWT Token
        String token = jwtTokenProvider.generateToken(authentication);

        log.info("Login successful for user: {}", user.getEmail());
        log.info("Returning roles: {}", user.getRoles());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "fullName", user.getFullName() != null ? user.getFullName() : "",
                        "roles",
                        user.getRoles().stream().map(Enum::name).collect(java.util.stream.Collectors.toList()),
                        "tier", user.getSubscriptionTier().name(),
                        "profileComplete", user.isProfileComplete())));
    }

    @PostMapping("/profile-setup")
    public ResponseEntity<?> setupProfile(
            @RequestBody ProfileSetupRequest request,
            HttpServletRequest httpRequest,
            @AuthenticationPrincipal OAuth2User principal) {

        log.info("Profile setup request");

        String userEmail = null;

        // Try OAuth2 principal first (Google login)
        if (principal != null) {
            userEmail = principal.getAttribute("email");
            log.info("Using OAuth2 principal email: {}", userEmail);
        }

        // Fallback to session (normal login)
        if (userEmail == null) {
            HttpSession session = httpRequest.getSession(false);
            if (session != null) {
                userEmail = (String) session.getAttribute("userEmail");
                log.info("Using session email: {}", userEmail);
            }
        }

        if (userEmail == null) {
            log.warn("Profile setup failed: Not authenticated");
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (userOpt.isEmpty()) {
            log.warn("Profile setup failed: User not found for email: {}", userEmail);
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        // Check username availability
        if (request.username() != null && !request.username().isBlank()) {
            Optional<User> existingUsername = userRepository.findByUsername(request.username());
            if (existingUsername.isPresent() && !existingUsername.get().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Username already taken",
                        "code", "USERNAME_EXISTS"));
            }
            user.setUsername(request.username());
        }

        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName());
        }
        if (request.birthDate() != null) {
            user.setBirthDate(request.birthDate());
        }

        user.setProfileComplete(true);
        user.setRoles(new java.util.HashSet<>(java.util.Set.of(User.Role.LEARNER)));
        userRepository.save(user);

        log.info("Profile setup complete for user: {}", userEmail);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Profile setup complete!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Logged out"));
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(
            HttpServletRequest request,
            @AuthenticationPrincipal OAuth2User principal) {

        String userEmail = null;

        // Try OAuth2 principal first
        if (principal != null) {
            userEmail = principal.getAttribute("email");
        }

        // Fallback to session
        if (userEmail == null) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                userEmail = (String) session.getAttribute("userEmail");
            }
        }

        if (userEmail == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        User user = userOpt.get();
        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "fullName", user.getFullName() != null ? user.getFullName() : "",
                        "roles", user.getRoles(),
                        "tier", user.getSubscriptionTier().name(),
                        "profileComplete", user.isProfileComplete())));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        log.info("Mocking forgot-password for: {}", request.email());
        return ResponseEntity.ok(Map.of("success", true, "message",
                "If an account with that email exists, a password reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        log.info("Mocking reset-password with token: {}", request.token());
        return ResponseEntity.ok(Map.of("success", true, "message", "Password has been successfully reset."));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        log.info("Mocking verify-email with token: {}", token);
        return ResponseEntity.ok(Map.of("success", true, "message", "Email verified successfully."));
    }
}
