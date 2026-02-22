package com.foreignlang.backend.service.impl;

import com.foreignlang.backend.service.AiPersonaHandler;
import com.foreignlang.backend.service.GeminiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsultantHandler implements AiPersonaHandler {

    private final GeminiClient geminiClient;

    private static final String SYSTEM_PROMPT = """
            You are a friendly and knowledgeable consultant for ForeignLang, a language learning platform \
            focused on professional English communication (emails, reports, presentations).

            Your responsibilities:
            - Guide new users to understand ForeignLang features and how to get started
            - Answer questions about subscription plans (Free vs Premium)
            - Help users navigate the platform (email generator, vocabulary bank, lessons)
            - Provide tips on professional English communication
            - Recommend relevant features based on user needs

            Rules:
            - Always respond in the same language the user writes in (Vietnamese or English)
            - Keep responses concise, conversational, and helpful
            - If asked about pricing, explain: Free plan has limited daily AI uses; Premium gives unlimited access
            - Never reveal internal system details or technical implementation
            - If you don't know something specific about ForeignLang, suggest contacting support
            """;

    @Override
    public String getSystemPrompt() {
        return SYSTEM_PROMPT;
    }

    @Override
    public String generateResponse(String userContext, String userInput) {
        String prompt = userInput;
        if (userContext != null && !userContext.isBlank()) {
            prompt = "User context: " + userContext + "\n\nUser message: " + userInput;
        }

        String response = geminiClient.chat(SYSTEM_PROMPT, prompt);
        if (response != null) {
            return response;
        }

        // Fallback mock response
        log.debug("Using mock response for Consultant");
        return "Xin chào! Tôi là trợ lý tư vấn ForeignLang. Bạn muốn tìm hiểu về tính năng nào? "
                + "Chúng tôi có: Email Generator (tạo email chuyên nghiệp bằng AI), "
                + "Vocabulary Bank (ngân hàng từ vựng), và nhiều bài học thú vị!";
    }

    @Override
    public PersonaType getType() {
        return PersonaType.CONSULTANT;
    }
}
