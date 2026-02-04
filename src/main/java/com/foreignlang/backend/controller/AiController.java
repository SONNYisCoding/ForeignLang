package com.foreignlang.backend.controller;

import com.foreignlang.backend.service.AiPersonaHandler;
import com.foreignlang.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestParam AiPersonaHandler.PersonaType type,
                                       @RequestParam(required = false) String context,
                                       @RequestBody String input) {
        // TODO: Add Quota Check here
        String response = aiService.getResponse(type, context, input);
        return ResponseEntity.ok(response);
    }
}
