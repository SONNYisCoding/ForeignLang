package com.foreignlang.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "usage_quotas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsageQuota {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(name = "purchased_credits", nullable = true) // Nullable for migration
    @Builder.Default
    private Integer purchasedCredits = 5; // Initial bonus or purchased

    // Free credits (resets weekly)
    @Column(name = "free_credits", nullable = true) // Nullable for migration
    @Builder.Default
    private Integer freeCredits = 2;

    // Subscription credits (resets monthly)
    // Subscription credits (resets monthly)
    @Column(name = "subscription_credits", nullable = true) // Nullable for migration
    @Builder.Default
    private Integer subscriptionCredits = 0;

    // Ad-rewarded uses today (max 3/day, resets every day)
    @Column(name = "ad_uses_today", nullable = true) // Nullable for migration
    @Builder.Default
    private Integer adUsesToday = 0;

    // --- DEPRECATED FIELDS (Keep for legacy DB compatibility) ---
    @Column(name = "daily_free_uses", nullable = true) // Set nullable=true to avoid issues if we drop it later
    @Builder.Default
    private int dailyFreeUses = 2; // Default to satisfy NOT NULL if exists

    @Column(name = "bonus_uses", nullable = true)
    @Builder.Default
    private int bonusUses = 0;

    @Column(name = "last_reset_date", nullable = true) // Legacy field
    private LocalDate lastResetDate;
    // ------------------------------------------------------------

    // Limits
    private static final int MAX_ADS_PER_DAY = 3;
    private static final int WEEKLY_FREE_LIMIT = 2;
    private static final int MONTHLY_SUB_LIMIT = 20;

    @Column(name = "last_free_reset")
    private LocalDate lastFreeReset;

    @Column(name = "last_sub_reset")
    private LocalDate lastSubReset;

    @Column(name = "last_ad_reset")
    private LocalDate lastAdReset;

    // Check if user can use AI
    public boolean canUseAI(boolean isPremium) {
        checkAndResetQuotas(isPremium);
        return (freeCredits != null ? freeCredits : 0) > 0 ||
                (subscriptionCredits != null ? subscriptionCredits : 0) > 0 ||
                (purchasedCredits != null ? purchasedCredits : 0) > 0;
    }

    // Get remaining uses for display
    public int getRemainingUses(boolean isPremium) {
        checkAndResetQuotas(isPremium);
        return (freeCredits != null ? freeCredits : 0) +
                (subscriptionCredits != null ? subscriptionCredits : 0) +
                (purchasedCredits != null ? purchasedCredits : 0);
    }

    // Use one AI credit
    public boolean useOneCredit(boolean isPremium) {
        checkAndResetQuotas(isPremium);

        // Priority 1: Free Weekly Credits
        if (freeCredits != null && freeCredits > 0) {
            freeCredits--;
            return true;
        }
        // Priority 2: Subscription Credits (if Premium)
        if (isPremium && subscriptionCredits != null && subscriptionCredits > 0) {
            subscriptionCredits--;
            return true;
        }
        // Priority 3: Purchased/Bonus Credits
        if (purchasedCredits != null && purchasedCredits > 0) {
            purchasedCredits--;
            return true;
        }
        return false;
    }

    // Reward user for watching an ad
    public boolean rewardAdWatch() {
        checkAndResetQuotas(false); // Ad limit is daily
        if (adUsesToday == null)
            adUsesToday = 0;
        if (adUsesToday < MAX_ADS_PER_DAY) {
            if (purchasedCredits == null)
                purchasedCredits = 0;
            purchasedCredits++; // Ads give permanent credits
            adUsesToday++;
            return true;
        }
        return false;
    }

    public boolean canWatchAd() {
        checkAndResetQuotas(false);
        return (adUsesToday != null ? adUsesToday : 0) < MAX_ADS_PER_DAY;
    }

    // Rolling Window Reset Logic
    public void checkAndResetQuotas(boolean isPremium) {
        LocalDate now = LocalDate.now();

        // 1. Weekly Free Reset (Rolling 7 days)
        if (lastFreeReset == null) {
            lastFreeReset = now;
            freeCredits = WEEKLY_FREE_LIMIT;
        } else if (now.isAfter(lastFreeReset.plusDays(6))) { // 7th day implies reset
            lastFreeReset = now;
            freeCredits = WEEKLY_FREE_LIMIT;
        }

        // 2. Monthly Subscription Reset (Rolling 30 days)
        if (isPremium) {
            if (lastSubReset == null) {
                lastSubReset = now;
                subscriptionCredits = MONTHLY_SUB_LIMIT;
            } else if (now.isAfter(lastSubReset.plusDays(29))) { // 30th day implies reset
                lastSubReset = now;
                subscriptionCredits = MONTHLY_SUB_LIMIT;
            }
        }

        // 3. Daily Ad Limit Reset
        if (lastAdReset == null || now.isAfter(lastAdReset)) {
            lastAdReset = now;
            adUsesToday = 0;
        }
    }

    // Initialize for new user
    public static UsageQuota createForNewUser(User user) {
        return UsageQuota.builder()
                .user(user)
                .purchasedCredits(5) // Signup Bonus
                .freeCredits(2)
                .subscriptionCredits(0)
                .adUsesToday(0)
                .lastFreeReset(LocalDate.now())
                .lastAdReset(LocalDate.now())
                .lastResetDate(LocalDate.now()) // Legacy support
                .build();
    }
}
