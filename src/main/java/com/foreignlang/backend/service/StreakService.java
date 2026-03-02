package com.foreignlang.backend.service;

import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final UserRepository userRepository;

    private ZoneId getZoneIdOrDefault(String timezone) {
        if (timezone == null || timezone.isBlank())
            return ZoneId.systemDefault();
        try {
            return ZoneId.of(timezone);
        } catch (Exception e) {
            return ZoneId.systemDefault();
        }
    }

    @Transactional
    public void updateStreak(User user, String timezone) {
        ZoneId zoneId = getZoneIdOrDefault(timezone);
        LocalDate today = LocalDate.now(zoneId);
        LocalDate lastActivity = user.getLastActivityDate();

        if (lastActivity != null && lastActivity.equals(today)) {
            return; // Already active today
        }

        if (lastActivity != null && lastActivity.equals(today.minusDays(1))) {
            user.setStreakDays(user.getStreakDays() + 1);
        } else {
            user.setStreakDays(1); // Reset or start new streak
        }

        user.setLastActivityDate(today);
        userRepository.save(user);

        // Notify Gamification handles milestone logic
    }

    public int getEffectiveStreak(User user, String timezone) {
        if (user.getStreakDays() == 0)
            return 0;

        LocalDate lastActivity = user.getLastActivityDate();
        if (lastActivity == null)
            return 0;

        ZoneId zoneId = getZoneIdOrDefault(timezone);
        LocalDate today = LocalDate.now(zoneId);

        // If last activity was today or yesterday, streak is valid
        if (lastActivity.equals(today) || lastActivity.equals(today.minusDays(1))) {
            return user.getStreakDays();
        }

        // Otherwise streak is broken
        return 0;
    }
}
