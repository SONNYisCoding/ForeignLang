package com.foreignlang.backend.service;

import com.foreignlang.backend.entity.ChatMessage;
import com.foreignlang.backend.entity.ChatSession;
import com.foreignlang.backend.repository.ChatMessageRepository;
import com.foreignlang.backend.repository.ChatSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;

    public ChatService(
            ChatSessionRepository chatSessionRepository,
            ChatMessageRepository chatMessageRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
    }


    @Transactional
    public ChatSession startOrResumeSession(String userIdStr, String guestId) {
        if (userIdStr != null) {
            UUID userId = UUID.fromString(userIdStr);
            return chatSessionRepository.findFirstByUserIdAndIsActiveTrueOrderByLastActivityDesc(userId)
                    .orElseGet(() -> createSession(userId, null));
        } else {
            return chatSessionRepository.findFirstByGuestIdAndIsActiveTrueOrderByLastActivityDesc(guestId)
                    .orElseGet(() -> createSession(null, guestId));
        }
    }

    private ChatSession createSession(UUID userId, String guestId) {
        ChatSession session = ChatSession.builder()
                .userId(userId)
                .guestId(guestId)
                .isActive(true)
                .build();
        return chatSessionRepository.save(session);
    }

    @Transactional
    public ChatMessage saveMessage(UUID sessionId, String sender, String content) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        session.setLastActivity(LocalDateTime.now());
        chatSessionRepository.save(session);

        ChatMessage message = ChatMessage.builder()
                .sessionId(sessionId)
                .sender(ChatMessage.Sender.valueOf(sender))
                .content(content)
                .build();

        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getSessionHistory(UUID sessionId) {
        return chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }

    // Admin Methods
    public List<ChatSession> getAllSessions() {
        return chatSessionRepository.findAll();
    }
}
