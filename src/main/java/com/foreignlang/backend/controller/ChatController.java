package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.ChatMessage;
import com.foreignlang.backend.entity.ChatSession;
import com.foreignlang.backend.security.UserPrincipal;
import com.foreignlang.backend.service.AiService;
import com.foreignlang.backend.service.AiPersonaHandler;
import com.foreignlang.backend.service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chat")
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final AiService aiService;

    public ChatController(
            ChatService chatService,
            AiService aiService) {
        this.chatService = chatService;
        this.aiService = aiService;
    }


    @PostMapping("/session")
    public ResponseEntity<ChatSession> startSession(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, String> payload) {
        String userId = currentUser != null ? currentUser.getUser().getId().toString() : null;
        String guestId = payload.get("guestId");

        ChatSession session = chatService.startOrResumeSession(userId, guestId);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/message")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody Map<String, Object> payload) {
        UUID sessionId = UUID.fromString(payload.get("sessionId").toString());
        String sender = (String) payload.get("sender");
        String content = (String) payload.get("content");

        ChatMessage savedMsg = chatService.saveMessage(sessionId, sender, content);

        // Generate AI response when user sends a message
        if ("USER".equals(sender)) {
            try {
                String aiResponse = aiService.getResponse(
                        AiPersonaHandler.PersonaType.CONSULTANT, null, content);
                chatService.saveMessage(sessionId, "BOT", aiResponse);
            } catch (Exception e) {
                log.error("Failed to generate AI chat response", e);
                chatService.saveMessage(sessionId, "BOT",
                        "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        }

        return ResponseEntity.ok(savedMsg);
    }

    @GetMapping("/history/{sessionId}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable UUID sessionId) {
        return ResponseEntity.ok(chatService.getSessionHistory(sessionId));
    }
}
