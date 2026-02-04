package com.foreignlang.backend.service.impl;

import com.foreignlang.backend.service.AiPersonaHandler;
import org.springframework.stereotype.Service;

@Service
public class TeacherHandler implements AiPersonaHandler {

    @Override
    public String getSystemPrompt() {
        return "You are an English teacher. Explain concepts clearly and provide examples.";
    }

    @Override
    public String generateResponse(String userContext, String userInput) {
        // TODO: Integrate with actual AI Client
        return "Mock response from Teacher: " + userInput;
    }

    @Override
    public PersonaType getType() {
        return PersonaType.TEACHER;
    }
}
