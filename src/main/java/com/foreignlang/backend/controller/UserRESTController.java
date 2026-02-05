package com.foreignlang.backend.controller;

import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.repository.UsageQuotaRepository;
import com.foreignlang.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserRESTController {

    private final UserRepository userRepository;
    private final UsageQuotaRepository usageQuotaRepository;
    private final SubscriptionService subscriptionService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        String email = null;
        String name = "User";
        String avatar = null;

        // 1. Try OAuth2 (Google)
        if (principal != null) {
            email = principal.getAttribute("email");
            name = principal.getAttribute("name");
            avatar = principal.getAttribute("picture");
        }

        // 2. Try Manual Session (Form Login)
        else {
            jakarta.servlet.http.HttpSession session = httpRequest.getSession(false);
            if (session != null) {
                email = (String) session.getAttribute("userEmail");
            }
        }

        if (email == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        if (avatar != null)
            response.put("avatar", avatar);
        if (name != null)
            response.put("name", name);

        // Database Info
        userRepository.findByEmail(email).ifPresent(user -> {
            // Use database name if available
            if (user.getFullName() != null && !user.getFullName().isBlank()) {
                response.put("name", user.getFullName());
            }

            boolean isPremium = subscriptionService.isPremium(user.getId());
            response.put("tier", isPremium ? "PREMIUM" : "FREE");
            response.put("isPremium", isPremium);
            response.put("role", user.getRole().name());
            response.put("profileComplete", user.isProfileComplete());
            response.put("username", user.getUsername());

            usageQuotaRepository.findByUserId(user.getId()).ifPresent(quota -> {
                quota.resetIfNewDay();
                int remaining = quota.getRemainingUses(isPremium);
                response.put("bonusUses", quota.getBonusUses());
                response.put("dailyFreeUses", quota.getDailyFreeUses());
                response.put("adsRemaining", 3 - quota.getAdUsesToday());
                response.put("usageRemaining", remaining);
                response.put("usageLimit", isPremium ? -1 : (quota.getBonusUses() + quota.getDailyFreeUses())); // -1 =
                                                                                                                // Unlimited
            });
        });

        return ResponseEntity.ok(response);
    }

    @org.springframework.web.bind.annotation.PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @org.springframework.web.bind.annotation.RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {

        String email = null;
        if (principal != null) {
            email = principal.getAttribute("email");
        } else {
            jakarta.servlet.http.HttpSession session = httpRequest.getSession(false);
            if (session != null) {
                email = (String) session.getAttribute("userEmail");
            }
        }

        if (email == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String finalEmail = email;
        return userRepository.findByEmail(email).map(user -> {
            if (request.fullName() != null && !request.fullName().isBlank()) {
                user.setFullName(request.fullName());
            }
            if (request.username() != null && !request.username().isBlank()) {
                // Check if username collision
                userRepository.findByUsername(request.username())
                        .filter(u -> !u.getId().equals(user.getId()))
                        .ifPresent(u -> {
                            throw new IllegalArgumentException("Username already taken");
                        });
                user.setUsername(request.username());
            }
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "message", "Profile updated"));
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    public record ProfileUpdateRequest(String fullName, String username) {
    }
}
