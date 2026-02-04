package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.Subscription;
import com.foreignlang.backend.service.SubscriptionService;
import com.foreignlang.backend.service.UsageQuotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        int remainingRequests = usageQuotaService.getRemainingRequests(userId);
        int currentUsage = usageQuotaService.getCurrentUsage(userId);

        Map<String, Object> status = Map.of(
                "userId", userId,
                "isPremium", isPremium,
                "tier", isPremium ? "PREMIUM" : "FREE",
                "dailyRequestsUsed", currentUsage,
                "dailyRequestsRemaining", isPremium ? "unlimited" : remainingRequests,
                "dailyLimit", isPremium ? "unlimited" : 5);

        return ResponseEntity.ok(status);
    }

    /**
     * Check if user can make an AI request
     */
    @GetMapping("/can-request/{userId}")
    public ResponseEntity<Map<String, Object>> canMakeRequest(@PathVariable UUID userId) {
        boolean canRequest = usageQuotaService.canMakeRequest(userId);
        int remaining = usageQuotaService.getRemainingRequests(userId);

        return ResponseEntity.ok(Map.of(
                "canMakeRequest", canRequest,
                "remainingRequests", remaining));
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
