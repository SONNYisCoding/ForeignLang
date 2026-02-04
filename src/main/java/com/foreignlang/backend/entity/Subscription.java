package com.foreignlang.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Subscription - Tracks premium subscription history for billing and audit purposes.
 * Supports the Freemium business model.
 */
@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false)
    private PlanType planType;

    @Column(name = "amount_vnd")
    private BigDecimal amountVnd;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @Column(name = "payment_reference")
    private String paymentReference;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum PlanType {
        MONTHLY,    // ~29,000 VND
        QUARTERLY,  // ~79,000 VND
        YEARLY      // Future expansion
    }

    public enum Status {
        ACTIVE, EXPIRED, CANCELLED
    }

    /**
     * Check if subscription is currently active
     */
    public boolean isActive() {
        return this.status == Status.ACTIVE 
            && LocalDateTime.now().isBefore(this.endDate);
    }
}
