package com.foreignlang.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.foreignlang.backend.entity.ProficiencyLevel;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.service.GeminiClient;
import com.foreignlang.backend.service.StreakService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/assessment")
@RequiredArgsConstructor
@Slf4j
public class AssessmentController {

    private final UserRepository userRepository;
    private final StreakService streakService;
    private final GeminiClient geminiClient;

    private static final String WRITING_EVAL_PROMPT = """
            You are an English language proficiency evaluator for ForeignLang, an email writing platform.
            Evaluate the following email writing sample and provide a detailed assessment.

            Scoring criteria (each 0-10):
            - grammar: Correctness of grammar, punctuation, and sentence structure
            - vocabulary: Range and appropriateness of vocabulary used
            - coherence: Logical flow, organization, and clarity of ideas
            - tone: Appropriateness of professional/formal tone for email writing

            Calculate an overall score (0-100) based on: (grammar + vocabulary + coherence + tone) * 2.5

            You MUST respond in this exact JSON format (no markdown, just raw JSON):
            {"score": <number 0-100>, "grammar": <number 0-10>, "vocabulary": <number 0-10>, "coherence": <number 0-10>, "tone": <number 0-10>, "feedback": "<2-3 sentences of constructive feedback>", "level": "<BEGINNER or INTERMEDIATE or ADVANCED>"}
            """;

    private User getAuthenticatedUser(OAuth2User principal, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String email = null;

        // 1. Check for UserPrincipal (Unified for OAuth2 and Form Login)
        if (principal instanceof com.foreignlang.backend.security.UserPrincipal userPrincipal) {
            return userPrincipal.getUser();
        }
        // 2. Fallback for raw OAuth2User
        else if (principal != null) {
            email = principal.getAttribute("email");
        }
        // 3. Try Manual Session (Form Login)
        else {
            jakarta.servlet.http.HttpSession session = httpRequest.getSession(false);
            if (session != null) {
                email = (String) session.getAttribute("userEmail");
            }
        }

        if (email == null)
            return null;
        return userRepository.findByEmail(email).orElse(null);
    }

    /**
     * Original MCQ-only assessment (backward compatible)
     */
    @PostMapping("/submit")
    @Transactional
    public ResponseEntity<?> submitAssessment(@RequestBody Map<String, Object> request,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        Integer score = (Integer) request.get("score");
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

        String learningGoal = (String) request.get("learningGoal");
        if (learningGoal != null) {
            user.setLearningGoal(learningGoal);
        }

        user.setProficiencyLevel(level);
        user.setProfileComplete(true);

        // Update streak
        streakService.updateStreak(user, httpRequest.getHeader("X-Timezone"));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "score", score,
                "level", level,
                "message", "Assessment completed successfully"));
    }

    /**
     * AI-evaluated writing assessment.
     * Combines MCQ score (40%) + AI writing evaluation (60%).
     */
    @PostMapping("/evaluate-writing")
    @Transactional
    public ResponseEntity<?> evaluateWriting(@RequestBody Map<String, Object> request,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        String writingSample = (String) request.get("writingSample");
        Integer mcqScore = request.get("mcqScore") != null ? ((Number) request.get("mcqScore")).intValue() : 0;
        String learningGoal = (String) request.get("learningGoal");

        if (writingSample == null || writingSample.trim().length() < 20) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Writing sample must be at least 20 characters"));
        }

        // Try AI evaluation
        int aiScore;
        String feedback;
        int grammar = 0, vocabulary = 0, coherence = 0, tone = 0;

        JsonNode aiResult = geminiClient.chatAsJson(WRITING_EVAL_PROMPT,
                "Evaluate this email writing sample:\n\n" + writingSample);

        if (aiResult != null) {
            aiScore = aiResult.has("score") ? aiResult.get("score").asInt() : 50;
            feedback = aiResult.has("feedback") ? aiResult.get("feedback").asText()
                    : "Assessment completed.";
            grammar = aiResult.has("grammar") ? aiResult.get("grammar").asInt() : 5;
            vocabulary = aiResult.has("vocabulary") ? aiResult.get("vocabulary").asInt() : 5;
            coherence = aiResult.has("coherence") ? aiResult.get("coherence").asInt() : 5;
            tone = aiResult.has("tone") ? aiResult.get("tone").asInt() : 5;
            log.info("AI writing evaluation: score={}, grammar={}, vocabulary={}, coherence={}, tone={}",
                    aiScore, grammar, vocabulary, coherence, tone);
        } else {
            // Mock fallback when Gemini not configured
            log.info("Gemini not configured, using mock writing evaluation");
            int wordCount = writingSample.split("\\s+").length;
            if (wordCount > 80)
                aiScore = 70;
            else if (wordCount > 40)
                aiScore = 50;
            else
                aiScore = 30;
            grammar = aiScore / 10;
            vocabulary = aiScore / 10;
            coherence = aiScore / 10;
            tone = aiScore / 10;
            feedback = "Your writing has been evaluated based on length and structure. " +
                    "For detailed AI feedback, the platform administrator needs to configure the Gemini API key.";
        }

        // Combine: MCQ 40% + AI Writing 60%
        int totalScore = (int) (mcqScore * 0.4 + aiScore * 0.6);

        ProficiencyLevel level;
        if (totalScore >= 75) {
            level = ProficiencyLevel.ADVANCED;
        } else if (totalScore >= 45) {
            level = ProficiencyLevel.INTERMEDIATE;
        } else {
            level = ProficiencyLevel.BEGINNER;
        }

        // Update user
        if (learningGoal != null) {
            user.setLearningGoal(learningGoal);
        }
        user.setProficiencyLevel(level);
        user.setProfileComplete(true);
        streakService.updateStreak(user, httpRequest.getHeader("X-Timezone"));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "level", level.name(),
                "totalScore", totalScore,
                "mcqScore", mcqScore,
                "aiScore", aiScore,
                "grammar", grammar,
                "vocabulary", vocabulary,
                "coherence", coherence,
                "tone", tone,
                "feedback", feedback));
    }
}
