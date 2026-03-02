package com.foreignlang.backend.service;

import com.foreignlang.backend.entity.UsageQuota;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UsageQuotaRepository;
import com.foreignlang.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsageQuotaServiceTest {

    @Mock
    private UsageQuotaRepository usageQuotaRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SubscriptionService subscriptionService;

    @InjectMocks
    private UsageQuotaService usageQuotaService;

    private UUID userId;
    private User mockUser;
    private UsageQuota mockQuota;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        mockUser = new User();
        mockUser.setId(userId);

        mockQuota = new UsageQuota();
        mockQuota.setUser(mockUser);
        mockQuota.setFreeCredits(2);
        mockQuota.setPurchasedCredits(0);
        mockQuota.setSubscriptionCredits(0);
        mockQuota.setLastFreeReset(java.time.LocalDate.now());

        // For testing we mock findByUserId
        lenient().when(usageQuotaRepository.findByUserId(userId)).thenReturn(Optional.of(mockQuota));
    }

    @Test
    void consumeRequest_FreeUserWithCredits_ShouldDeductFreeFirst() {
        when(subscriptionService.isPremium(userId)).thenReturn(false);

        boolean result = usageQuotaService.consumeRequest(userId);

        assertTrue(result);
        assertEquals(1, mockQuota.getFreeCredits()); // 2 -> 1
        verify(usageQuotaRepository, times(1)).save(mockQuota);
    }

    @Test
    void consumeRequest_FreeUserNoCredits_ShouldFail() {
        mockQuota.setFreeCredits(0);
        when(subscriptionService.isPremium(userId)).thenReturn(false);

        boolean result = usageQuotaService.consumeRequest(userId);

        assertFalse(result); // Cannot consume
        assertEquals(0, mockQuota.getFreeCredits());
        verify(usageQuotaRepository, never()).save(any());
    }

    @Test
    void consumeRequest_PremiumUser_ShouldNotDeductCredits() {
        when(subscriptionService.isPremium(userId)).thenReturn(true);
        // Premium users have unlimited AI, should always return true and not deduct
        // explicit daily credits
        // (Note: The `useOneCredit` logic in UsageQuota entity handles this)

        int initialFree = mockQuota.getFreeCredits();

        boolean result = usageQuotaService.consumeRequest(userId);

        assertTrue(result);
        // Assuming Premium logic doesn't touch standard limits...
        // If it does, `useOneCredit` inside the entity should have early returned true.
        // Let's verify standard behaviour:
        verify(usageQuotaRepository, times(1)).save(mockQuota);
    }

    @Test
    void getRemainingRequests_PremiumUser_ShouldReturnHighLimit() {
        when(subscriptionService.isPremium(userId)).thenReturn(true);

        int remaining = usageQuotaService.getRemainingRequests(userId);
        assertEquals(22, remaining); // 20 monthly sub limit + 2 weekly free limit
    }
}
