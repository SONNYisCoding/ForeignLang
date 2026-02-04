package com.foreignlang.backend.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AiService {

    private final Map<AiPersonaHandler.PersonaType, AiPersonaHandler> handlers;

    public AiService(List<AiPersonaHandler> handlerList) {
        this.handlers = handlerList.stream()
                .collect(Collectors.toMap(AiPersonaHandler::getType, Function.identity()));
    }

    public String getResponse(AiPersonaHandler.PersonaType type, String context, String input) {
        AiPersonaHandler handler = handlers.get(type);
        if (handler == null) {
            throw new IllegalArgumentException("No handler found for type: " + type);
        }
        return handler.generateResponse(context, input);
    }
}
