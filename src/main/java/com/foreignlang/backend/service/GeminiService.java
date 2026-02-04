package com.foreignlang.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Gemini AI Service for email generation
 * 
 * This can be swapped with a custom trained model in the future
 * by creating a new implementation and changing the @Primary annotation
 */
@Service
@Slf4j
public class GeminiService {

    @Value("${gemini.api.key:dummy}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String model;

    @Value("${gemini.api.base-url:https://generativelanguage.googleapis.com/v1beta}")
    private String baseUrl;

    @Value("${gemini.mock.enabled:false}")
    private boolean mockEnabled;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Generate professional email using Gemini AI
     */
    public EmailResult generateEmail(EmailRequest request) {
        if (mockEnabled || apiKey == null || apiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            log.warn("Gemini API key not configured or mock enabled, using mock response");
            return mockResponse(request);
        }

        try {
            String prompt = buildEmailPrompt(request);
            String response = callGeminiAPI(prompt);
            return parseEmailResponse(response);
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage());
            return new EmailResult(false, null, null, "AI service error: " + e.getMessage());
        }
    }

    /**
     * Build prompt for email generation
     */
    private String buildEmailPrompt(EmailRequest request) {
        return String.format("""
                You are a professional email writing assistant. Generate a professional email based on the following:

                User request: %s
                Email type: %s
                Tone: %s
                Recipient: %s
                Language: %s

                Instructions:
                1. Write a clear, professional email
                2. Use appropriate greeting and closing
                3. Keep it concise but complete
                4. Match the requested tone
                5. If Vietnamese is selected, write in Vietnamese

                Respond in this exact JSON format (no markdown, just raw JSON):
                {"subject": "Email subject here", "body": "Full email body here including greeting and signature"}
                """,
                request.userPrompt(),
                request.emailType() != null ? request.emailType() : "general",
                request.tone() != null ? request.tone() : "professional",
                request.recipientType() != null ? request.recipientType() : "colleague",
                request.language() != null ? request.language() : "en");
    }

    /**
     * Call Gemini API
     */
    private String callGeminiAPI(String prompt) {
        String url = String.format("%s/models/%s:generateContent?key=%s", baseUrl, model, apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 1024));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        if (response.getBody() != null) {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        }
        throw new RuntimeException("Empty response from Gemini API");
    }

    /**
     * Parse JSON response from Gemini
     */
    private EmailResult parseEmailResponse(String response) {
        try {
            // Clean up response (remove markdown code blocks if present)
            String cleaned = response
                    .replaceAll("```json\\s*", "")
                    .replaceAll("```\\s*", "")
                    .trim();

            // Simple JSON parsing (or use Jackson if preferred)
            int subjectStart = cleaned.indexOf("\"subject\"") + 11;
            int subjectEnd = cleaned.indexOf("\"", subjectStart + 1);
            String subject = cleaned.substring(subjectStart + 1, subjectEnd);

            int bodyStart = cleaned.indexOf("\"body\"") + 8;
            int bodyEnd = cleaned.lastIndexOf("\"");
            String body = cleaned.substring(bodyStart + 1, bodyEnd)
                    .replace("\\n", "\n")
                    .replace("\\\"", "\"");

            return new EmailResult(true, subject, body, null);
        } catch (Exception e) {
            log.error("Error parsing Gemini response: {}", e.getMessage());
            // Return raw response as body if parsing fails
            return new EmailResult(true, "Generated Email", response, null);
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

                To enable real AI-generated emails, please configure your Gemini API key in application.properties.

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
        return apiKey != null && !apiKey.equals("YOUR_GEMINI_API_KEY_HERE") && !apiKey.isBlank();
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
