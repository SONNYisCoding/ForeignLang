package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.Notification;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.NotificationRepository;
import com.foreignlang.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }


    private User getAuthenticatedUser(OAuth2User principal, jakarta.servlet.http.HttpServletRequest httpRequest) {
        // 1. Check for UserPrincipal (Unified representation)
        if (principal instanceof com.foreignlang.backend.security.UserPrincipal userPrincipal) {
            return userPrincipal.getUser();
        }

        String email = null;
        // 2. Fallback for raw OAuth2User
        if (principal != null) {
            email = principal.getAttribute("email");
        }
        // 3. Manual Session Fallback
        else {
            jakarta.servlet.http.HttpSession session = httpRequest.getSession(false);
            if (session != null) {
                email = (String) session.getAttribute("userEmail");
            }
        }

        if (email == null)
            return null;
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(@AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        long count = notificationRepository.countByUserIdAndReadFalse(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/read")
    @Transactional
    public ResponseEntity<?> markAsRead(@PathVariable UUID id,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        return notificationRepository.findById(id).map(notification -> {
            if (notification.getUser() == null || !notification.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
            }
            notification.setRead(true);
            notificationRepository.save(notification);
            return ResponseEntity.ok(Map.of("success", true));
        }).map(r -> (ResponseEntity<?>) r).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/read-all")
    @Transactional
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        unread.forEach(n -> {
            if (!n.isRead()) {
                n.setRead(true);
            }
        });
        notificationRepository.saveAll(unread);

        return ResponseEntity.ok(Map.of("success", true));
    }
}
