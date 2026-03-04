package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.service.UsageQuotaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/quota")
@Slf4j
public class UsageQuotaController {

    private final UserRepository userRepository;
    private final UsageQuotaService usageQuotaService;

    public UsageQuotaController(
            UserRepository userRepository,
            UsageQuotaService usageQuotaService) {
        this.userRepository = userRepository;
        this.usageQuotaService = usageQuotaService;
    }


    private String getUserEmail(HttpServletRequest request) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            Object principal = auth.getPrincipal();

            System.out.println(
                    "=== PRINCIPAL CLASS ===: " + (principal != null ? principal.getClass().getName() : "NULL"));

            if (principal instanceof com.foreignlang.backend.security.UserPrincipal userPrincipal) {
                return userPrincipal.getUser().getEmail();
            } else if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User oauth2User) {
                if (oauth2User.getAttributes() != null) {
                    return oauth2User.getAttribute("email");
                }
            } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
                return userDetails.getUsername(); // Assuming username is email
            } else if (principal instanceof String principalString) {
                return principalString;
            }
            return auth.getName();
        }

        jakarta.servlet.http.HttpSession session = request.getSession(false);
        if (session != null) {
            return (String) session.getAttribute("userEmail");
        }

        return null;
    }

    /**
     * Consume 1 AI credit (Global Endpoint)
     */
    @PostMapping("/consume")
    public ResponseEntity<?> consumeCredit(HttpServletRequest httpRequest) {

        String userEmail = getUserEmail(httpRequest);
        if (userEmail == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        if (!usageQuotaService.consumeRequest(user.getId())) {
            return ResponseEntity.status(429).body(Map.of(
                    "error", "No credits remaining",
                    "code", "QUOTA_EXCEEDED"));
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "remainingUses", usageQuotaService.getRemainingUses(user.getId())));
    }

    /**
     * Watch ad to get more credits
     */
    @PostMapping("/ad-reward")
    public ResponseEntity<?> watchAdReward(HttpServletRequest httpRequest) {

        String userEmail = getUserEmail(httpRequest);
        if (userEmail == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        if (!usageQuotaService.rewardAdWatch(user.getId())) {
            return ResponseEntity.status(400).body(Map.of(
                    "error", "Daily ad limit reached",
                    "code", "AD_LIMIT_REACHED"));
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "remainingUses", usageQuotaService.getRemainingUses(user.getId())));
    }
}
