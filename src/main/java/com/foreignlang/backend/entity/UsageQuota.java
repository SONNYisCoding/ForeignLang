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
    private User user;

    // Signup bonus uses (one-time, doesn't reset)
    @Column(name = "bonus_uses", nullable = false)
    @Builder.Default
    private int bonusUses = 5;

    // Daily free uses (resets every day)
    @Column(name = "daily_free_uses", nullable = false)
    @Builder.Default
    private int dailyFreeUses = 2;

    // Ad-rewarded uses today (max 3/day, resets every day)
    @Column(name = "ad_uses_today", nullable = false)
    @Builder.Default
    private int adUsesToday = 0;

    // Max ads per day
    private static final int MAX_ADS_PER_DAY = 3;
    private static final int DAILY_FREE_LIMIT = 2;

    @Column(name = "last_reset_date", nullable = false)
    private LocalDate lastResetDate;

    // Check if user can use AI (has any available uses)
    public boolean canUseAI(boolean isPremium) {
        if (isPremium)
            return true; // Unlimited for premium
        resetIfNewDay();
        return bonusUses > 0 || dailyFreeUses > 0;
    }

    // Check if user can watch ad for extra use
    public boolean canWatchAd() {
        resetIfNewDay();
        return adUsesToday < MAX_ADS_PER_DAY;
    }

    // Get remaining uses for display
    public int getRemainingUses(boolean isPremium) {
        if (isPremium)
            return -1; // -1 means unlimited
        resetIfNewDay();
        return bonusUses + dailyFreeUses;
    }

    // Use one AI credit (prioritizes: bonus → daily free)
    public boolean useOneCredit(boolean isPremium) {
        if (isPremium)
            return true; // Premium users don't consume credits

        resetIfNewDay();

        if (bonusUses > 0) {
            bonusUses--;
            return true;
        }
        if (dailyFreeUses > 0) {
            dailyFreeUses--;
            return true;
        }
        return false; // No credits available
    }

    // Reward user for watching an ad
    public boolean rewardAdWatch() {
        resetIfNewDay();
        if (adUsesToday < MAX_ADS_PER_DAY) {
            dailyFreeUses++; // Add 1 use
            adUsesToday++; // Track ad count
            return true;
        }
        return false; // Max ads reached
    }

    // Reset daily counters if new day
    public void resetIfNewDay() {
        if (lastResetDate == null || LocalDate.now().isAfter(lastResetDate)) {
            dailyFreeUses = DAILY_FREE_LIMIT; // Reset to 2
            adUsesToday = 0;
            lastResetDate = LocalDate.now();
        }
    }

    // Initialize for new user
    public static UsageQuota createForNewUser(User user) {
        return UsageQuota.builder()
                .user(user)
                .bonusUses(5)
                .dailyFreeUses(2)
                .adUsesToday(0)
                .lastResetDate(LocalDate.now())
                .build();
    }
}
