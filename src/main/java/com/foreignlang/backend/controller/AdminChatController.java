package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.ChatMessage;
import com.foreignlang.backend.entity.ChatSession;
import com.foreignlang.backend.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/chat")
public class AdminChatController {

    private final ChatService chatService;

    public AdminChatController(
            ChatService chatService) {
        this.chatService = chatService;
    }


    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSession>> getAllSessions() {
        // In a real app, use pagination
        return ResponseEntity.ok(chatService.getAllSessions());
    }

    @GetMapping("/session/{sessionId}/messages")
    public ResponseEntity<List<ChatMessage>> getSessionMessages(@PathVariable UUID sessionId) {
        return ResponseEntity.ok(chatService.getSessionHistory(sessionId));
    }
}
