package com.foreignlang.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Shared Gemini API Client used by all AI features.
 * Provides a clean interface for calling the Gemini API with system/user
 * prompts.
 * Falls back to mock responses when API is not configured.
 */
@Component
@Slf4j
public class GeminiClient {

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String model;

    @Value("${gemini.api.base-url:https://generativelanguage.googleapis.com/v1beta}")
    private String baseUrl;

    @Value("${gemini.mock.enabled:true}")
    private boolean mockEnabled;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Check if the Gemini API is properly configured and available.
     */
    public boolean isConfigured() {
        return !mockEnabled && apiKey != null && !apiKey.isBlank()
                && !apiKey.equals("dummy") && !apiKey.equals("change_me");
    }

    /**
     * Call Gemini API with a system prompt and user input.
     *
     * @param systemPrompt The system instruction defining the AI persona
     * @param userInput    The user's message/question
     * @return The AI-generated text response
     */
    public String chat(String systemPrompt, String userInput) {
        if (!isConfigured()) {
            log.debug("Gemini not configured, returning mock response");
            return null; // Caller should handle mock fallback
        }

        try {
            return callGeminiApi(systemPrompt, userInput);
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return null; // Caller should handle fallback
        }
    }

    /**
     * Call Gemini API with system instruction support.
     */
    private String callGeminiApi(String systemPrompt, String userInput) {
        String url = String.format("%s/models/%s:generateContent?key=%s", baseUrl, model, apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build request with system instruction (Gemini 1.5+ feature)
        Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", systemPrompt))),
                "contents", List.of(
                        Map.of("role", "user",
                                "parts", List.of(Map.of("text", userInput)))),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 2048));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        return extractTextFromResponse(response.getBody());
    }

    /**
     * Extract text content from Gemini API JSON response using Jackson.
     */
    private String extractTextFromResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");

            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");

                if (parts.isArray() && !parts.isEmpty()) {
                    return parts.get(0).path("text").asText();
                }
            }

            throw new RuntimeException("No text content in Gemini response");
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }

    /**
     * Call Gemini and parse the response as JSON (for structured outputs like
     * Evaluator).
     *
     * @return Parsed JsonNode, or null if parsing fails
     */
    public JsonNode chatAsJson(String systemPrompt, String userInput) {
        String text = chat(systemPrompt, userInput);
        if (text == null)
            return null;

        try {
            // Clean markdown code fences if present
            String cleaned = text
                    .replaceAll("```json\\s*", "")
                    .replaceAll("```\\s*", "")
                    .trim();
            return objectMapper.readTree(cleaned);
        } catch (Exception e) {
            log.error("Failed to parse AI response as JSON: {}", e.getMessage());
            return null;
        }
    }
}
