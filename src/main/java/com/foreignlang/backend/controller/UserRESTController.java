package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.User;
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
    private static final int FREE_DAILY_LIMIT = 5;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String email = principal.getAttribute("email");
        Map<String, Object> response = new HashMap<>();

        // Basic Info from OAuth
        response.put("name", principal.getAttribute("name"));
        response.put("email", email);
        response.put("avatar", principal.getAttribute("picture"));

        // Database Info
        userRepository.findByEmail(email).ifPresent(user -> {
            boolean isPremium = subscriptionService.isPremium(user.getId());
            response.put("tier", isPremium ? "PREMIUM" : "FREE");
            response.put("isPremium", isPremium);

            usageQuotaRepository.findByUserId(user.getId()).ifPresent(quota -> {
                quota.resetIfNewDay();
                response.put("usageCount", quota.getDailyRequestsCount());
                response.put("usageLimit", isPremium ? -1 : FREE_DAILY_LIMIT); // -1 = Unlimited
            });
        });

        return ResponseEntity.ok(response);
    }
}
