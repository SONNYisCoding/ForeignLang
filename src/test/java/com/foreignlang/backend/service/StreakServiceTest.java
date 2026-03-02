package com.foreignlang.backend.service;

import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StreakServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StreakService streakService;

    @Test
    void testUpdateStreak_AlreadyActiveToday() {
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        User user = new User();
        user.setStreakDays(5);
        user.setLastActivityDate(today);

        streakService.updateStreak(user, null);

        // Should return early, no save, streak unchanged
        assertEquals(5, user.getStreakDays());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testUpdateStreak_ActiveYesterday() {
        ZoneId tokyoZone = ZoneId.of("Asia/Tokyo");
        LocalDate today = LocalDate.of(2026, 1, 15);

        User user = new User();
        user.setStreakDays(5);
        user.setLastActivityDate(LocalDate.of(2026, 1, 14)); // Active yesterday

        try (MockedStatic<LocalDate> mockedLocalDate = Mockito.mockStatic(LocalDate.class,
                Mockito.CALLS_REAL_METHODS)) {
            mockedLocalDate.when(() -> LocalDate.now(eq(tokyoZone))).thenReturn(today);

            streakService.updateStreak(user, "Asia/Tokyo");

            // Streak increments
            assertEquals(6, user.getStreakDays());
            assertEquals(today, user.getLastActivityDate());
            verify(userRepository, times(1)).save(user);
        }
    }

    @Test
    void testUpdateStreak_BrokenStreak() {
        ZoneId utcZone = ZoneId.of("UTC");
        LocalDate today = LocalDate.of(2026, 1, 15);

        User user = new User();
        user.setStreakDays(5);
        user.setLastActivityDate(LocalDate.of(2026, 1, 13)); // Active 2 days ago -> broken

        try (MockedStatic<LocalDate> mockedLocalDate = Mockito.mockStatic(LocalDate.class,
                Mockito.CALLS_REAL_METHODS)) {
            mockedLocalDate.when(() -> LocalDate.now(eq(utcZone))).thenReturn(today);

            streakService.updateStreak(user, "UTC");

            // Streak resets to 1
            assertEquals(1, user.getStreakDays());
            assertEquals(today, user.getLastActivityDate());
            verify(userRepository, times(1)).save(user);
        }
    }

    @Test
    void testUpdateStreak_EdgeCaseTimezoneDifferentDate() {
        // Edge Case:
        // Time in New York is 2026-02-24 23:00 (11PM)
        // System default (server) might be UTC where it's already 2026-02-25 04:00 (4AM
        // next day)
        // User's timezone should dictate the logic.
        ZoneId nyZone = ZoneId.of("America/New_York");
        LocalDate nyToday = LocalDate.of(2026, 2, 24);

        User user = new User();
        user.setStreakDays(3);
        user.setLastActivityDate(LocalDate.of(2026, 2, 23)); // Active yesterday in NY

        try (MockedStatic<LocalDate> mockedLocalDate = Mockito.mockStatic(LocalDate.class,
                Mockito.CALLS_REAL_METHODS)) {
            mockedLocalDate.when(() -> LocalDate.now(eq(nyZone))).thenReturn(nyToday);

            streakService.updateStreak(user, "America/New_York");

            // Streak correctly increments to 4 based on New York's calendar date
            assertEquals(4, user.getStreakDays());
            assertEquals(nyToday, user.getLastActivityDate());
            verify(userRepository, times(1)).save(user);
        }
    }
}
