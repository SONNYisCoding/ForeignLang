package com.foreignlang.backend.service.impl;

import com.foreignlang.backend.service.AiPersonaHandler;
import org.springframework.stereotype.Service;

@Service
public class ConsultantHandler implements AiPersonaHandler {

    @Override
    public String getSystemPrompt() {
        return "You are a helpful consultant for ForeignLang. Guide users to sign up or explain our features.";
    }

    @Override
    public String generateResponse(String userContext, String userInput) {
        // TODO: Integrate with actual AI Client (OpenAI/Gemini)
        return "Mock response from Consultant: " + userInput;
    }

    @Override
    public PersonaType getType() {
        return PersonaType.CONSULTANT;
    }
}
