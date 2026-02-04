package com.foreignlang.backend.service.impl;

import com.foreignlang.backend.service.AiPersonaHandler;
import org.springframework.stereotype.Service;

@Service
public class EvaluatorHandler implements AiPersonaHandler {

    @Override
    public String getSystemPrompt() {
        return "You are a strict evaluator. Check grammar, tone, and structure. Return JSON format.";
    }

    @Override
    public String generateResponse(String userContext, String userInput) {
        // TODO: Integrate with actual AI Client
        return "{\"score\": 8, \"feedback\": \"Good job!\"}";
    }

    @Override
    public PersonaType getType() {
        return PersonaType.EVALUATOR;
    }
}
