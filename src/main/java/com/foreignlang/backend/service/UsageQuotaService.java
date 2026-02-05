package com.foreignlang.backend.service;

import com.foreignlang.backend.entity.UsageQuota;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UsageQuotaRepository;
import com.foreignlang.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service for managing and enforcing daily usage quotas.
 * Hybrid model: 5 bonus + 2 daily free + 3 from ads
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UsageQuotaService {

    private final UsageQuotaRepository usageQuotaRepository;
    private final SubscriptionService subscriptionService;

    /**
     * Check if a user can make an AI request (has quota remaining)
     */
    public boolean canMakeRequest(UUID userId) {
        UsageQuota quota = getOrCreateQuota(userId);
        boolean isPremium = subscriptionService.isPremium(userId);
        return quota.canUseAI(isPremium);
    }

    /**
     * Check if user can watch an ad for extra credits
     */
    public boolean canWatchAd(UUID userId) {
        UsageQuota quota = getOrCreateQuota(userId);
        return quota.canWatchAd();
    }

    /**
     * Record an AI request usage
     * 
     * @return true if request was allowed, false if quota exceeded
     */
    @Transactional
    public boolean consumeRequest(UUID userId) {
        UsageQuota quota = getOrCreateQuota(userId);
        boolean isPremium = subscriptionService.isPremium(userId);

        if (!quota.useOneCredit(isPremium)) {
            log.warn("User {} has no available credits", userId);
            return false;
        }

        usageQuotaRepository.save(quota);
        log.debug("User {} used 1 credit, remaining: {}", userId, quota.getRemainingUses(isPremium));
        return true;
    }

    /**
     * Reward user for watching an ad
     * 
     * @return true if reward was granted, false if max ads reached
     */
    @Transactional
    public boolean rewardAdWatch(UUID userId) {
        UsageQuota quota = getOrCreateQuota(userId);

        if (!quota.rewardAdWatch()) {
            log.warn("User {} has reached max ads for today", userId);
            return false;
        }

        usageQuotaRepository.save(quota);
        log.debug("User {} watched ad, gained 1 credit", userId);
        return true;
    }

    /**
     * Get remaining requests for a user today
     */
    public int getRemainingRequests(UUID userId) {
        UsageQuota quota = getOrCreateQuota(userId);
        boolean isPremium = subscriptionService.isPremium(userId);
        return quota.getRemainingUses(isPremium);
    }

    /**
     * Alias for getRemainingRequests (used by EmailGenerationController)
     */
    public int getRemainingUses(UUID userId) {
        return getRemainingRequests(userId);
    }

    /**
     * Alias for canWatchAd (used by EmailGenerationController)
     */
    public boolean canWatchAdForBonus(UUID userId) {
        return canWatchAd(userId);
    }

    /**
     * Get quota details for display
     */
    /**
     * Get quota details for display
     */
    public QuotaStatus getQuotaStatus(UUID userId) {
        UsageQuota quota = getOrCreateQuota(userId);
        boolean isPremium = subscriptionService.isPremium(userId);
        quota.checkAndResetQuotas(isPremium);

        return new QuotaStatus(
                quota.getPurchasedCredits(),
                quota.getFreeCredits(),
                quota.getSubscriptionCredits(),
                quota.getAdUsesToday(),
                3 - quota.getAdUsesToday(), // Remaining ads
                isPremium,
                quota.getRemainingUses(isPremium));
    }

    public record QuotaStatus(
            int purchasedCredits,
            int freeCredits,
            int subscriptionCredits,
            int adsWatchedToday,
            int adsRemaining,
            boolean isPremium,
            int totalRemaining) {
    }

    private final UserRepository userRepository;

    private UsageQuota getOrCreateQuota(UUID userId) {
        return usageQuotaRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalStateException("User not found: " + userId));

                    log.info("Creating new UsageQuota for user: {}", userId);
                    UsageQuota newQuota = UsageQuota.createForNewUser(user);
                    return usageQuotaRepository.save(newQuota);
                });
    }
}
