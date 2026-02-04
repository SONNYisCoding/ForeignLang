package com.foreignlang.backend.service;

public interface AiPersonaHandler {
    String getSystemPrompt();
    String generateResponse(String userContext, String userInput);
    PersonaType getType();

    enum PersonaType {
        CONSULTANT, TEACHER, EVALUATOR
    }
}
