package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.Subscription;
import com.foreignlang.backend.entity.Transaction;
import com.foreignlang.backend.entity.UsageQuota;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.SubscriptionRepository;
import com.foreignlang.backend.repository.TransactionRepository;
import com.foreignlang.backend.repository.UsageQuotaRepository;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserRESTControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private UsageQuotaRepository usageQuotaRepository;

    @InjectMocks
    private UserRESTController userRESTController;

    private User testUser;
    private UserPrincipal principal;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("test@example.com");
        testUser.setSubscriptionTier(User.SubscriptionTier.FREE);

        principal = new UserPrincipal(testUser);
    }

    @Test
    void testProcessUpgrade_PremiumSubscription_Success() {
        // Arrange
        UserRESTController.UpgradeRequest request = new UserRESTController.UpgradeRequest("PREMIUM", "subscription",
                BigDecimal.valueOf(300000));
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        // Act
        ResponseEntity<?> response = userRESTController.processUpgrade(request, principal, null);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertTrue((Boolean) body.get("success"));

        // Verify tier updated and saved
        assertEquals(User.SubscriptionTier.PREMIUM, testUser.getSubscriptionTier());
        verify(userRepository, times(1)).save(testUser);

        // Verify Transaction created
        verify(transactionRepository, times(1)).save(any(Transaction.class));

        // Verify Subscription created
        verify(subscriptionRepository, times(1)).save(any(Subscription.class));
    }

    @Test
    void testProcessUpgrade_AICredits_Success() {
        // Arrange
        UserRESTController.UpgradeRequest request = new UserRESTController.UpgradeRequest("credits-15", "credits",
                BigDecimal.valueOf(50000));
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        UsageQuota mockQuota = new UsageQuota();
        mockQuota.setUser(testUser);
        mockQuota.setPurchasedCredits(0);
        when(usageQuotaRepository.findByUserId(testUser.getId())).thenReturn(Optional.of(mockQuota));

        // Act
        ResponseEntity<?> response = userRESTController.processUpgrade(request, principal, null);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertTrue((Boolean) body.get("success"));

        // Verify Credits added
        assertEquals(15, mockQuota.getPurchasedCredits());
        verify(usageQuotaRepository, times(1)).save(mockQuota);

        // Verify Transaction created
        verify(transactionRepository, times(1)).save(any(Transaction.class));

        // Ensure no subscription was created
        verify(subscriptionRepository, never()).save(any(Subscription.class));
    }

    @Test
    void testProcessUpgrade_InvalidType_BadRequest() {
        // Arrange
        UserRESTController.UpgradeRequest request = new UserRESTController.UpgradeRequest("PREMIUM", "invalid_type",
                BigDecimal.ZERO);
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        // Act
        ResponseEntity<?> response = userRESTController.processUpgrade(request, principal, null);

        // Assert
        assertEquals(400, response.getStatusCode().value());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void testProcessUpgrade_InvalidPlanId_BadRequest() {
        // Arrange
        UserRESTController.UpgradeRequest request = new UserRESTController.UpgradeRequest("NOT_PREMIUM", "subscription",
                BigDecimal.ZERO);
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        // Act
        ResponseEntity<?> response = userRESTController.processUpgrade(request, principal, null);

        // Assert
        assertEquals(400, response.getStatusCode().value());
        verify(subscriptionRepository, never()).save(any());
    }
}
