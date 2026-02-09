package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.ChatMessage;
import com.foreignlang.backend.entity.ChatSession;
import com.foreignlang.backend.security.UserPrincipal;
import com.foreignlang.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

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
        Long sessionId = Long.valueOf(payload.get("sessionId").toString());
        String sender = (String) payload.get("sender");
        String content = (String) payload.get("content");

        ChatMessage savedMsg = chatService.saveMessage(sessionId, sender, content);

        // Simple Mock Bot Reply Logic
        if ("USER".equals(sender)) {
            // In a real app, call AI Service here
            new Thread(() -> {
                try {
                    Thread.sleep(1000);
                    chatService.saveMessage(sessionId, "BOT", "I received your message: " + content);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }

        return ResponseEntity.ok(savedMsg);
    }

    @GetMapping("/history/{sessionId}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable Long sessionId) {
        return ResponseEntity.ok(chatService.getSessionHistory(sessionId));
    }
}
