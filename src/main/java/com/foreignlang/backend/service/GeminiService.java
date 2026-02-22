package com.foreignlang.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Gemini AI Service for email generation.
 * Delegates API calls to GeminiClient and uses Jackson for response parsing.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiService {

    private final GeminiClient geminiClient;

    private static final String EMAIL_SYSTEM_PROMPT = """
            You are a professional email writing assistant for ForeignLang. \
            Generate a professional email based on the user's requirements.

            Instructions:
            1. Write a clear, professional email
            2. Use appropriate greeting and closing
            3. Keep it concise but complete
            4. Match the requested tone
            5. If Vietnamese is selected, write entirely in Vietnamese

            You MUST respond in this exact JSON format (no markdown, just raw JSON):
            {"subject": "Email subject here", "body": "Full email body here including greeting and signature"}
            """;

    /**
     * Generate professional email using Gemini AI
     */
    public EmailResult generateEmail(EmailRequest request) {
        String prompt = buildEmailPrompt(request);

        JsonNode json = geminiClient.chatAsJson(EMAIL_SYSTEM_PROMPT, prompt);
        if (json != null) {
            return parseJsonEmailResponse(json);
        }

        // Fallback to mock
        log.info("Gemini not configured or returned null, using mock response");
        return mockResponse(request);
    }

    /**
     * Build user prompt for email generation
     */
    private String buildEmailPrompt(EmailRequest request) {
        return String.format("""
                User request: %s
                Email type: %s
                Tone: %s
                Recipient: %s
                Language: %s
                """,
                request.userPrompt(),
                request.emailType() != null ? request.emailType() : "general",
                request.tone() != null ? request.tone() : "professional",
                request.recipientType() != null ? request.recipientType() : "colleague",
                request.language() != null ? request.language() : "en");
    }

    /**
     * Parse JSON email response from Gemini using Jackson
     */
    private EmailResult parseJsonEmailResponse(JsonNode json) {
        try {
            String subject = json.has("subject") ? json.get("subject").asText() : "Generated Email";
            String body = json.has("body") ? json.get("body").asText() : json.toString();
            return new EmailResult(true, subject, body, null);
        } catch (Exception e) {
            log.error("Error parsing email JSON response: {}", e.getMessage());
            return new EmailResult(true, "Generated Email", json.toString(), null);
        }
    }

    /**
     * Mock response when API key not configured
     */
    private EmailResult mockResponse(EmailRequest request) {
        String subject = "Re: " + (request.userPrompt() != null
                ? request.userPrompt().substring(0, Math.min(50, request.userPrompt().length()))
                : "Your Request");

        String body = """
                Dear %s,

                Thank you for reaching out. This is a demo response from the ForeignLang AI Email Generator.

                To enable real AI-generated emails, please configure your Gemini API key in .env file:
                GEMINI_API_KEY=your_actual_key_here

                Then set gemini.mock.enabled=false in application.properties.

                Best regards,
                ForeignLang Team

                ---
                [Demo Mode - Configure GEMINI_API_KEY for real responses]
                """.formatted(request.recipientType() != null ? request.recipientType() : "Recipient");

        return new EmailResult(true, subject, body, null);
    }

    /**
     * Check if service is properly configured
     */
    public boolean isConfigured() {
        return geminiClient.isConfigured();
    }

    // DTOs
    public record EmailRequest(
            String userPrompt,
            String tone,
            String language,
            String emailType,
            String recipientType) {
    }

    public record EmailResult(
            boolean success,
            String subject,
            String body,
            String error) {
    }
}
