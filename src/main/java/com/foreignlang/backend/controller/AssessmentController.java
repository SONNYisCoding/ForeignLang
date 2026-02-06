package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.ProficiencyLevel;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/assessment")
@RequiredArgsConstructor
public class AssessmentController {

    private final UserRepository userRepository;

    private User getAuthenticatedUser(OAuth2User principal, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String email = null;
        if (principal != null) {
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

    @PostMapping("/submit")
    @Transactional
    public ResponseEntity<?> submitAssessment(@RequestBody Map<String, Integer> request,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        Integer score = request.get("score");
        if (score == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Score is required"));
        }

        ProficiencyLevel level;
        if (score >= 80) {
            level = ProficiencyLevel.ADVANCED;
        } else if (score >= 50) {
            level = ProficiencyLevel.INTERMEDIATE;
        } else {
            level = ProficiencyLevel.BEGINNER;
        }

        user.setProficiencyLevel(level);
        user.setProfileComplete(true); // Assuming assessment completes profile
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "score", score,
                "level", level,
                "message", "Assessment completed successfully"));
    }
}
