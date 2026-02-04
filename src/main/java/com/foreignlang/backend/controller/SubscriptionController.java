package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.Subscription;
import com.foreignlang.backend.service.SubscriptionService;
import com.foreignlang.backend.service.UsageQuotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for subscription and usage management.
 * Part of the Subscription & Usage Core module.
 */
@RestController
@RequestMapping("/api/v1/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UsageQuotaService usageQuotaService;

    /**
     * Get user's current subscription status and usage
     */
    @GetMapping("/status/{userId}")
    public ResponseEntity<Map<String, Object>> getSubscriptionStatus(@PathVariable UUID userId) {
        boolean isPremium = subscriptionService.isPremium(userId);
        UsageQuotaService.QuotaStatus quotaStatus = usageQuotaService.getQuotaStatus(userId);

        Map<String, Object> status = new HashMap<>();
        status.put("userId", userId);
        status.put("isPremium", isPremium);
        status.put("tier", isPremium ? "PREMIUM" : "FREE");
        status.put("bonusUses", quotaStatus.bonusUses());
        status.put("dailyFreeUses", quotaStatus.dailyFreeUses());
        status.put("adsWatchedToday", quotaStatus.adsWatchedToday());
        status.put("adsRemaining", quotaStatus.adsRemaining());
        status.put("totalRemaining", isPremium ? "unlimited" : (quotaStatus.bonusUses() + quotaStatus.dailyFreeUses()));

        return ResponseEntity.ok(status);
    }

    /**
     * Check if user can make an AI request
     */
    @GetMapping("/can-request/{userId}")
    public ResponseEntity<Map<String, Object>> canMakeRequest(@PathVariable UUID userId) {
        boolean canRequest = usageQuotaService.canMakeRequest(userId);
        int remaining = usageQuotaService.getRemainingRequests(userId);
        boolean canWatchAd = usageQuotaService.canWatchAd(userId);

        return ResponseEntity.ok(Map.of(
                "canMakeRequest", canRequest,
                "remainingRequests", remaining,
                "canWatchAd", canWatchAd));
    }

    /**
     * Reward user for watching an ad
     */
    @PostMapping("/watch-ad/{userId}")
    public ResponseEntity<Map<String, Object>> rewardAdWatch(@PathVariable UUID userId) {
        boolean success = usageQuotaService.rewardAdWatch(userId);

        if (success) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "You earned 1 AI credit!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "You've reached the maximum ads for today."));
        }
    }

    /**
     * Get active subscription details
     */
    @GetMapping("/active/{userId}")
    public ResponseEntity<?> getActiveSubscription(@PathVariable UUID userId) {
        var activeSubscription = subscriptionService.getActiveSubscription(userId);
        if (activeSubscription.isPresent()) {
            return ResponseEntity.ok(activeSubscription.get());
        }
        return ResponseEntity.ok(Map.of(
                "message", "No active subscription",
                "tier", "FREE"));
    }

    /**
     * Create a subscription (MVP: Demo payment simulation)
     * In production, this would be called after successful payment webhook
     */
    @PostMapping("/create")
    public ResponseEntity<Subscription> createSubscription(
            @RequestParam UUID userId,
            @RequestParam Subscription.PlanType planType,
            @RequestParam(required = false, defaultValue = "MVP_DEMO") String paymentReference) {

        Subscription subscription = subscriptionService.createSubscription(userId, planType, paymentReference);
        return ResponseEntity.ok(subscription);
    }

    /**
     * Cancel a subscription (Admin action)
     */
    @PostMapping("/cancel/{subscriptionId}")
    public ResponseEntity<Map<String, String>> cancelSubscription(@PathVariable UUID subscriptionId) {
        subscriptionService.cancelSubscription(subscriptionId);
        return ResponseEntity.ok(Map.of("message", "Subscription cancelled successfully"));
    }
}
