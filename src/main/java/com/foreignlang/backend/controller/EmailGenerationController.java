package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.service.GeminiService;
import com.foreignlang.backend.service.UsageQuotaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
@Slf4j
public class EmailGenerationController {

    private final GeminiService geminiService;
    private final UserRepository userRepository;
    private final UsageQuotaService usageQuotaService;

    /**
     * Generate email using AI
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateEmail(
            @RequestBody EmailGenerateRequest request,
            HttpServletRequest httpRequest,
            @AuthenticationPrincipal OAuth2User principal) {

        try {
            // Get authenticated user
            String userEmail = getUserEmail(httpRequest, principal);
            if (userEmail == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "error", "Please login to use AI email generation",
                        "code", "UNAUTHORIZED"));
            }

            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            boolean isPremium = user.getSubscriptionTier() == User.SubscriptionTier.PREMIUM;

            // Check usage quota
            if (!usageQuotaService.canMakeRequest(user.getId())) {
                return ResponseEntity.status(429).body(Map.of(
                        "error", "You've used all your AI credits for today",
                        "code", "QUOTA_EXCEEDED",
                        "canWatchAd", usageQuotaService.canWatchAdForBonus(user.getId()),
                        "upgradeUrl", "/pricing"));
            }

            // Generate email
            log.info("Generating email for user: {}, prompt: {}", userEmail, request.prompt());

            GeminiService.EmailRequest aiRequest = new GeminiService.EmailRequest(
                    request.prompt(),
                    request.tone(),
                    request.language(),
                    request.emailType(),
                    request.recipientType());

            GeminiService.EmailResult result = geminiService.generateEmail(aiRequest);

            if (!result.success()) {
                return ResponseEntity.status(500).body(Map.of(
                        "error", result.error(),
                        "code", "AI_ERROR"));
            }

            // Consume quota
            usageQuotaService.consumeRequest(user.getId());

            // Return generated email
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "subject", result.subject(),
                    "body", result.body(),
                    "remainingUses", usageQuotaService.getRemainingUses(user.getId()),
                    "isPremium", isPremium));
        } catch (Exception e) {
            log.error("Unhandled exception in generateEmail", e);
            e.printStackTrace(); // Print to console for server logs
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Internal Server Error: " + e.getMessage(),
                    "trace", e.toString()));
        }
    }

    /**
     * Get AI service status
     */
    @GetMapping("/status")
    public ResponseEntity<?> getStatus() {
        return ResponseEntity.ok(Map.of(
                "configured", geminiService.isConfigured(),
                "model", "gemini-1.5-flash"));
    }

    /**
     * Watch ad to get more credits
     */
    @PostMapping("/ad-reward")
    public ResponseEntity<?> watchAdReward(
            HttpServletRequest httpRequest,
            @AuthenticationPrincipal OAuth2User principal) {

        String userEmail = getUserEmail(httpRequest, principal);
        if (userEmail == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        if (usageQuotaService.rewardAdWatch(user.getId())) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Ad watched! You earned 1 credit.",
                    "remainingUses", usageQuotaService.getRemainingUses(user.getId()),
                    "canWatchMore", usageQuotaService.canWatchAd(user.getId())));
        } else {
            return ResponseEntity.status(429).body(Map.of(
                    "error", "Daily ad limit reached",
                    "code", "AD_LIMIT_REACHED"));
        }
    }

    /**
     * Get user email from session or OAuth principal
     */
    private String getUserEmail(HttpServletRequest request, OAuth2User principal) {
        // Try OAuth2 principal first
        if (principal != null) {
            return principal.getAttribute("email");
        }

        // Fallback to session
        HttpSession session = request.getSession(false);
        if (session != null) {
            return (String) session.getAttribute("userEmail");
        }

        return null;
    }

    // Request DTO
    public record EmailGenerateRequest(
            String prompt,
            String tone,
            String language,
            String emailType,
            String recipientType) {
    }
}
