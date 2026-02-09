package com.foreignlang.backend.service;

import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final UserRepository userRepository;

    @Transactional
    public void updateStreak(User user) {
        LocalDate today = LocalDate.now();
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
    }

    public int getEffectiveStreak(User user) {
        if (user.getStreakDays() == 0)
            return 0;

        LocalDate lastActivity = user.getLastActivityDate();
        if (lastActivity == null)
            return 0;

        LocalDate today = LocalDate.now();

        // If last activity was today or yesterday, streak is valid
        if (lastActivity.equals(today) || lastActivity.equals(today.minusDays(1))) {
            return user.getStreakDays();
        }

        // Otherwise streak is broken
        return 0;
    }
}
