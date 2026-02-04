package com.foreignlang.backend.service;

import com.foreignlang.backend.entity.UsageQuota;
import com.foreignlang.backend.repository.UsageQuotaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service for managing and enforcing daily usage quotas.
 * Core component of the Freemium business model.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UsageQuotaService {

    private final UsageQuotaRepository usageQuotaRepository;
    private final SubscriptionService subscriptionService;

    // Free tier daily limit
    private static final int FREE_DAILY_LIMIT = 5;

    // Premium users have unlimited (represented by a high number)
    private static final int PREMIUM_DAILY_LIMIT = Integer.MAX_VALUE;

    /**
     * Check if a user can make an AI request (has quota remaining)
     */
    public boolean canMakeRequest(UUID userId) {
        UsageQuota quota = getOrCreateQuota(userId);
        quota.resetIfNewDay(); // Auto-reset if new day

        int limit = getDailyLimit(userId);
        return !quota.isQuotaExceeded(limit);
    }

    /**
     * Record an AI request usage
     * 
     * @return true if request was allowed, false if quota exceeded
     */
    @Transactional
    public boolean consumeRequest(UUID userId) {
        if (!canMakeRequest(userId)) {
            log.warn("User {} has exceeded daily quota", userId);
            return false;
        }

        UsageQuota quota = getOrCreateQuota(userId);
        quota.resetIfNewDay();
        quota.incrementUsage();
        usageQuotaRepository.save(quota);

        log.debug("User {} used request, count now: {}", userId, quota.getDailyRequestsCount());
        return true;
    }

    /**
     * Get remaining requests for a user today
     */
    public int getRemainingRequests(UUID userId) {
        UsageQuota quota = getOrCreateQuota(userId);
        quota.resetIfNewDay();

        int limit = getDailyLimit(userId);
        int remaining = limit - quota.getDailyRequestsCount();
        return Math.max(0, remaining);
    }

    /**
     * Get current usage count for today
     */
    public int getCurrentUsage(UUID userId) {
        UsageQuota quota = getOrCreateQuota(userId);
        quota.resetIfNewDay();
        return quota.getDailyRequestsCount();
    }

    /**
     * Get daily limit based on subscription tier
     */
    private int getDailyLimit(UUID userId) {
        return subscriptionService.isPremium(userId) ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;
    }

    private UsageQuota getOrCreateQuota(UUID userId) {
        return usageQuotaRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Usage quota not found for user: " + userId));
    }
}
