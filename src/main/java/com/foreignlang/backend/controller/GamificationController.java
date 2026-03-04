package com.foreignlang.backend.controller;

import com.foreignlang.backend.service.GamificationService;
import com.foreignlang.backend.service.StreakService;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/gamification")
public class GamificationController {

    private final GamificationService gamificationService;
    private final StreakService streakService;
    private final UserRepository userRepository;

    public GamificationController(
            GamificationService gamificationService,
            StreakService streakService,
            UserRepository userRepository) {
        this.gamificationService = gamificationService;
        this.streakService = streakService;
        this.userRepository = userRepository;
    }


    @GetMapping("/leaderboard/{groupId}")
    public ResponseEntity<?> getLeaderboard(@PathVariable UUID groupId) {
        try {
            List<Map<String, Object>> leaderboard = gamificationService.getGroupLeaderboard(groupId);
            return ResponseEntity.ok(leaderboard);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/streak")
    public ResponseEntity<?> getStreakInfo(@AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("currentStreak", streakService.getEffectiveStreak(user, httpRequest.getHeader("X-Timezone")));
        response.put("lastActivityDate", user.getLastActivityDate());

        // MVP: Only tracking consecutive days based on current streak count for the UI
        // calendar.
        // E.g. If current streak is 3, then today, yesterday, and day before are
        // active.
        return ResponseEntity.ok(response);
    }

    private User getAuthenticatedUser(OAuth2User principal, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String email = null;
        if (principal instanceof com.foreignlang.backend.security.UserPrincipal userPrincipal) {
            return userPrincipal.getUser();
        } else if (principal != null) {
            email = principal.getAttribute("email");
        } else {
            jakarta.servlet.http.HttpSession session = httpRequest.getSession(false);
            if (session != null) {
                email = (String) session.getAttribute("userEmail");
            }
        }
        if (email == null)
            return null;
        return userRepository.findByEmail(email).orElse(null);
    }
}
