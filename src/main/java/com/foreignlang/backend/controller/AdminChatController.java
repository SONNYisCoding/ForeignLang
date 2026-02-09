package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.ChatMessage;
import com.foreignlang.backend.entity.ChatSession;
import com.foreignlang.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/chat")
@RequiredArgsConstructor
public class AdminChatController {

    private final ChatService chatService;

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSession>> getAllSessions() {
        // In a real app, use pagination
        return ResponseEntity.ok(chatService.getAllSessions());
    }

    @GetMapping("/session/{sessionId}/messages")
    public ResponseEntity<List<ChatMessage>> getSessionMessages(@PathVariable Long sessionId) {
        return ResponseEntity.ok(chatService.getSessionHistory(sessionId));
    }
}
