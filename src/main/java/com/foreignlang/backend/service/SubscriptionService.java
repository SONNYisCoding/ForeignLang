package com.foreignlang.backend.service;

import com.foreignlang.backend.entity.Subscription;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.SubscriptionRepository;
import com.foreignlang.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing user subscriptions.
 * Handles premium upgrades and subscription validation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    // Pricing in VND
    private static final BigDecimal MONTHLY_PRICE = new BigDecimal("29000");
    private static final BigDecimal QUARTERLY_PRICE = new BigDecimal("79000");

    /**
     * Check if user has an active premium subscription
     */
    public boolean isPremium(UUID userId) {
        return subscriptionRepository.findActiveSubscriptionByUserId(userId).isPresent();
    }

    /**
     * Get current active subscription for a user
     */
    public Optional<Subscription> getActiveSubscription(UUID userId) {
        return subscriptionRepository.findActiveSubscriptionByUserId(userId);
    }

    /**
     * Create a new subscription for a user.
     * For MVP, this can be called manually by Admin or via a mock payment button.
     */
    @Transactional
    public Subscription createSubscription(UUID userId, Subscription.PlanType planType, String paymentReference) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate;
        BigDecimal amount;

        switch (planType) {
            case MONTHLY:
                endDate = now.plusMonths(1);
                amount = MONTHLY_PRICE;
                break;
            case QUARTERLY:
                endDate = now.plusMonths(3);
                amount = QUARTERLY_PRICE;
                break;
            case YEARLY:
                endDate = now.plusYears(1);
                amount = QUARTERLY_PRICE.multiply(new BigDecimal("4")); // Yearly = 4x quarterly
                break;
            default:
                throw new IllegalArgumentException("Unknown plan type: " + planType);
        }

        Subscription subscription = Subscription.builder()
                .user(user)
                .planType(planType)
                .amountVnd(amount)
                .startDate(now)
                .endDate(endDate)
                .status(Subscription.Status.ACTIVE)
                .paymentReference(paymentReference)
                .build();

        Subscription saved = subscriptionRepository.save(subscription);

        // Update user's subscription tier
        user.setSubscriptionTier(User.SubscriptionTier.PREMIUM);
        userRepository.save(user);

        log.info("Created {} subscription for user {} until {}", planType, user.getEmail(), endDate);

        return saved;
    }

    /**
     * Cancel a subscription (for admin use or user request)
     */
    @Transactional
    public void cancelSubscription(UUID subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Subscription not found"));

        subscription.setStatus(Subscription.Status.CANCELLED);
        subscriptionRepository.save(subscription);

        // Check if user has any other active subscriptions
        if (!isPremium(subscription.getUser().getId())) {
            User user = subscription.getUser();
            user.setSubscriptionTier(User.SubscriptionTier.FREE);
            userRepository.save(user);
        }

        log.info("Cancelled subscription {} for user {}", subscriptionId, subscription.getUser().getEmail());
    }
}
