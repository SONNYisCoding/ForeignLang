package com.foreignlang.backend.controller;

import com.foreignlang.backend.dto.ProfileUpdateRequest;
import com.foreignlang.backend.entity.UsageQuota;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.repository.UsageQuotaRepository;
import com.foreignlang.backend.repository.TransactionRepository;
import com.foreignlang.backend.repository.SubscriptionRepository;
import com.foreignlang.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserRESTController {

    private final UserRepository userRepository;
    private final UsageQuotaRepository usageQuotaRepository;
    private final TransactionRepository transactionRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionService subscriptionService;
    private final com.foreignlang.backend.service.StreakService streakService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public record SetupPasswordRequest(String newPassword) {
    }

    public record UpgradeRequest(String planId, String type, java.math.BigDecimal amount) {
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        String email = null;
        String name = "User";
        String avatar = null;

        // 1. Try OAuth2 (Google)
        // 1. Check for UserPrincipal (Unified for OAuth2 and Form Login)
        if (principal instanceof com.foreignlang.backend.security.UserPrincipal userPrincipal) {
            com.foreignlang.backend.entity.User user = userPrincipal.getUser();
            email = user.getEmail();
            name = user.getFullName();
            avatar = user.getAvatarUrl();
        }
        // 2. Fallback for raw OAuth2User (unlikely with our setup, but safe to keep)
        else if (principal != null) {
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
            // Use database avatar if available (override Google avatar)
            if (user.getAvatarUrl() != null && !user.getAvatarUrl().isBlank()) {
                response.put("avatar", user.getAvatarUrl());
            }

            boolean isPremium = subscriptionService.isPremium(user.getId());
            response.put("tier", isPremium ? "PREMIUM" : "FREE");
            response.put("isPremium", isPremium);
            response.put("roles", user.getRoles());
            response.put("profileComplete", user.isProfileComplete());
            response.put("username", user.getUsername());
            response.put("birthDate", user.getBirthDate());
            response.put("emailsGenerated", user.getEmailsGenerated());
            response.put("streak", streakService.getEffectiveStreak(user, httpRequest.getHeader("X-Timezone")));
            response.put("bio", user.getBio());
            response.put("specialization", user.getSpecialization());
            response.put("learningGoal", user.getLearningGoal());
            response.put("authProvider", user.getAuthProvider());

            UsageQuota quota = usageQuotaRepository.findByUserId(user.getId())
                    .orElseGet(() -> {
                        UsageQuota newQuota = UsageQuota.createForNewUser(user);
                        return usageQuotaRepository.save(newQuota);
                    });

            quota.checkAndResetQuotas(isPremium);
            usageQuotaRepository.save(quota); // Save potential reset

            int remaining = quota.getRemainingUses(isPremium);

            int purchased = quota.getPurchasedCredits() != null ? quota.getPurchasedCredits() : 0;
            int free = quota.getFreeCredits() != null ? quota.getFreeCredits() : 0;
            int sub = quota.getSubscriptionCredits() != null ? quota.getSubscriptionCredits() : 0;
            int adUses = quota.getAdUsesToday() != null ? quota.getAdUsesToday() : 0;

            response.put("purchasedCredits", purchased);
            response.put("freeCredits", free);
            response.put("subscriptionCredits", sub);

            response.put("adsRemaining", 3 - adUses);
            response.put("usageRemaining", remaining);

            // For display purposes, maybe show Total Limit if not premium
            int totalLimit = isPremium ? -1 : (purchased + 2 + sub);
            // Note: Hardcoded 2 for weekly limit visual if needed, but dynamic is better
            response.put("usageLimit", totalLimit);
        });

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {

        String email = null;
        if (principal instanceof com.foreignlang.backend.security.UserPrincipal userPrincipal) {
            email = userPrincipal.getUser().getEmail();
        } else if (principal != null) {
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
            if (request.avatarUrl() != null) { // Allow clearing avatar possibly, or just updating
                user.setAvatarUrl(request.avatarUrl());
            }
            if (request.birthDate() != null) {
                user.setBirthDate(request.birthDate());
            }
            if (request.bio() != null) {
                user.setBio(request.bio());
            }
            if (request.specialization() != null) {
                user.setSpecialization(request.specialization());
            }
            if (request.learningGoal() != null) {
                user.setLearningGoal(request.learningGoal());
            }
            if (request.proficiencyLevel() != null) {
                user.setProficiencyLevel(request.proficiencyLevel());
            }

            user.setProfileComplete(true); // Mark profile as complete on update if logic deems it

            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "message", "Profile updated"));
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    @PostMapping("/setup-password")
    public ResponseEntity<?> setupPassword(
            @RequestBody SetupPasswordRequest request,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {

        String email = null;
        if (principal instanceof com.foreignlang.backend.security.UserPrincipal userPrincipal) {
            email = userPrincipal.getUser().getEmail();
        } else if (principal != null) {
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

        if (request.newPassword() == null || request.newPassword().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
        }

        return userRepository.findByEmail(email).map(user -> {
            user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "message", "Password updated successfully"));
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    @PostMapping("/upgrade")
    public ResponseEntity<?> processUpgrade(
            @RequestBody UpgradeRequest request,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {

        String email = null;
        if (principal instanceof com.foreignlang.backend.security.UserPrincipal userPrincipal) {
            email = userPrincipal.getUser().getEmail();
        } else if (principal != null) {
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

        return userRepository.findByEmail(email).map(user -> {
            if (request.type() == null
                    || (!request.type().equals("subscription") && !request.type().equals("credits"))) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid or missing 'type'. Expected 'subscription' or 'credits'."));
            }
            if (request.planId() == null || request.planId().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error",
                        "Missing 'planId'. Expected a valid plan identifier like 'PREMIUM' or 'credits-15'."));
            }

            // Create Transaction Record
            com.foreignlang.backend.entity.Transaction tx = com.foreignlang.backend.entity.Transaction.builder()
                    .user(user)
                    .amount(request.amount() != null ? request.amount() : java.math.BigDecimal.ZERO)
                    .currency("VND")
                    .type("subscription".equals(request.type())
                            ? com.foreignlang.backend.entity.Transaction.Type.PRO_UPGRADE
                            : com.foreignlang.backend.entity.Transaction.Type.AI_CREDIT)
                    .status(com.foreignlang.backend.entity.Transaction.Status.SUCCESS)
                    .planId(request.planId())
                    .build();
            transactionRepository.save(tx);

            if ("subscription".equals(request.type())) {
                if (!request.planId().equalsIgnoreCase("PRO") && !request.planId().equalsIgnoreCase("PREMIUM")) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Invalid subscription planId. Expected 'PREMIUM'."));
                }
                user.setSubscriptionTier(com.foreignlang.backend.entity.User.SubscriptionTier.PREMIUM);
                userRepository.save(user);

                com.foreignlang.backend.entity.Subscription sub = com.foreignlang.backend.entity.Subscription.builder()
                        .user(user)
                        .planType(request.planId() != null && request.planId().contains("quarterly")
                                ? com.foreignlang.backend.entity.Subscription.PlanType.QUARTERLY
                                : com.foreignlang.backend.entity.Subscription.PlanType.MONTHLY)
                        .amountVnd(tx.getAmount())
                        .startDate(java.time.LocalDateTime.now())
                        .endDate(java.time.LocalDateTime.now()
                                .plusMonths(request.planId() != null && request.planId().contains("quarterly") ? 3 : 1))
                        .status(com.foreignlang.backend.entity.Subscription.Status.ACTIVE)
                        .build();
                subscriptionRepository.save(sub);

            } else if ("credits".equals(request.type())) {
                UsageQuota quota = usageQuotaRepository.findByUserId(user.getId())
                        .orElseGet(() -> UsageQuota.createForNewUser(user));

                int bonus = request.planId() != null && request.planId().contains("15") ? 15 : 5;
                quota.setPurchasedCredits(
                        (quota.getPurchasedCredits() != null ? quota.getPurchasedCredits() : 0) + bonus);
                usageQuotaRepository.save(quota);
            }

            return ResponseEntity.ok(Map.of("success", true, "message", "Upgrade successful"));
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactionHistory(
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {

        String email = null;
        if (principal instanceof com.foreignlang.backend.security.UserPrincipal userPrincipal) {
            email = userPrincipal.getUser().getEmail();
        } else if (principal != null) {
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

        return userRepository.findByEmail(email)
                .<ResponseEntity<?>>map(
                        user -> ResponseEntity.ok(transactionRepository.findByUserIdOrderByCreatedAtDesc(user.getId())))
                .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }
}
