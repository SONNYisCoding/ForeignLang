package com.foreignlang.backend.service.impl;

import com.foreignlang.backend.service.AiPersonaHandler;
import com.foreignlang.backend.service.GeminiClient;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluatorHandler implements AiPersonaHandler {

    private final GeminiClient geminiClient;

    private static final String SYSTEM_PROMPT = """
            You are a strict but fair English writing evaluator on ForeignLang, \
            specializing in professional communication assessment.

            When evaluating text, you MUST respond in this exact JSON format:
            {
                "score": <number from 1-10>,
                "overallFeedback": "<2-3 sentence summary>",
                "grammar": {
                    "score": <number from 1-10>,
                    "issues": ["<issue 1>", "<issue 2>"]
                },
                "tone": {
                    "score": <number from 1-10>,
                    "assessment": "<is the tone appropriate for the context?>"
                },
                "vocabulary": {
                    "score": <number from 1-10>,
                    "suggestions": ["<better word choice 1>", "<better word choice 2>"]
                },
                "correctedVersion": "<the improved version of the text>"
            }

            Evaluation criteria:
            - Grammar accuracy (spelling, tense, agreement, punctuation)
            - Tone appropriateness (formal/semi-formal based on context)
            - Vocabulary richness (professional word choices, avoid repetition)
            - Structure and clarity (logical flow, paragraph organization)
            - Common Vietnamese-English errors (article usage, prepositions, word order)

            Rules:
            - Always return valid JSON, no extra text outside the JSON
            - Be specific in feedback - cite the exact words/phrases with issues
            - Provide the corrected version with improvements highlighted
            - Score fairly: 1-3 needs major work, 4-6 acceptable, 7-8 good, 9-10 excellent
            """;

    @Override
    public String getSystemPrompt() {
        return SYSTEM_PROMPT;
    }

    @Override
    public String generateResponse(String userContext, String userInput) {
        String prompt = userInput;
        if (userContext != null && !userContext.isBlank()) {
            prompt = "Context (email type/purpose): " + userContext
                    + "\n\nText to evaluate:\n" + userInput;
        }

        // Try to get structured JSON response from Gemini
        JsonNode jsonResponse = geminiClient.chatAsJson(SYSTEM_PROMPT, prompt);
        if (jsonResponse != null) {
            return jsonResponse.toString();
        }

        // Fallback mock response
        log.debug("Using mock response for Evaluator");
        return """
                {
                    "score": 7,
                    "overallFeedback": "Good effort! Your writing is clear but could benefit from more formal vocabulary and varied sentence structures.",
                    "grammar": {
                        "score": 7,
                        "issues": ["Minor article usage errors", "Some tense inconsistencies"]
                    },
                    "tone": {
                        "score": 8,
                        "assessment": "Appropriate professional tone for the context"
                    },
                    "vocabulary": {
                        "score": 6,
                        "suggestions": ["Use 'inquire' instead of 'ask'", "Replace 'get' with 'obtain' or 'receive'"]
                    },
                    "correctedVersion": "Please enable AI integration for personalized corrections."
                }""";
    }

    @Override
    public PersonaType getType() {
        return PersonaType.EVALUATOR;
    }
}
