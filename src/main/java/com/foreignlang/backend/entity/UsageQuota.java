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

    @Column(name = "daily_requests_count", nullable = false)
    @Builder.Default
    private int dailyRequestsCount = 0;

    @Column(name = "last_reset_date", nullable = false)
    private LocalDate lastResetDate;

    // Business Logic: Check if quota is exceeded
    public boolean isQuotaExceeded(int limit) {
        return this.dailyRequestsCount >= limit;
    }

    // Business Logic: Increment usage
    public void incrementUsage() {
        this.dailyRequestsCount++;
    }

    // Business Logic: Reset if new day
    public void resetIfNewDay() {
        if (LocalDate.now().isAfter(this.lastResetDate)) {
            this.dailyRequestsCount = 0;
            this.lastResetDate = LocalDate.now();
        }
    }
}
