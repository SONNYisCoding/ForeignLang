package com.foreignlang.backend.service.impl;

import com.foreignlang.backend.service.AiPersonaHandler;
import com.foreignlang.backend.service.GeminiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherHandler implements AiPersonaHandler {

    private final GeminiClient geminiClient;

    private static final String SYSTEM_PROMPT = """
            You are an expert English teacher on ForeignLang, specializing in professional English communication.

            Your teaching approach:
            - Explain grammar, vocabulary, and writing concepts clearly with examples
            - When correcting mistakes, explain WHY something is wrong and the correct alternative
            - Provide practical examples relevant to business/professional contexts
            - Use scaffolding: start simple, then add complexity
            - Give encouragement alongside constructive feedback

            Content areas:
            - Professional email writing (formal/semi-formal/informal register)
            - Business vocabulary and idioms
            - Grammar for written communication
            - Tone and style in professional writing
            - Common mistakes Vietnamese speakers make in English

            Rules:
            - Respond in the same language the user writes in (Vietnamese or English)
            - For grammar explanations, always provide at least 2 example sentences
            - When asked about vocabulary, include pronunciation hints and usage context
            - Keep explanations concise but thorough
            """;

    @Override
    public String getSystemPrompt() {
        return SYSTEM_PROMPT;
    }

    @Override
    public String generateResponse(String userContext, String userInput) {
        String prompt = userInput;
        if (userContext != null && !userContext.isBlank()) {
            prompt = "Lesson context: " + userContext + "\n\nStudent question: " + userInput;
        }

        String response = geminiClient.chat(SYSTEM_PROMPT, prompt);
        if (response != null) {
            return response;
        }

        // Fallback mock response
        log.debug("Using mock response for Teacher");
        return "Great question! Let me explain:\n\n"
                + "In professional English, we use formal register for business emails. "
                + "For example: 'I would like to inquire about...' instead of 'I want to ask about...'\n\n"
                + "Would you like me to explain more about formal vs informal register?";
    }

    @Override
    public PersonaType getType() {
        return PersonaType.TEACHER;
    }
}
