package com.foreignlang.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Optional: Linked to a logged-in user
    @Column(name = "user_id")
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    // Optional: For guest users (stored in localStorage)
    @Column(name = "guest_id")
    private String guestId;

    @CreationTimestamp
    @Column(name = "start_time", updatable = false)
    private LocalDateTime startTime;

    @UpdateTimestamp
    @Column(name = "last_activity")
    private LocalDateTime lastActivity;

    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;

    // Helper to identify user type
    public String getUserType() {
        return userId != null ? "LEARNER" : "GUEST";
    }

    public String getDisplayName() {
        return userId != null && user != null ? user.getFullName()
                : "Guest (" + (guestId != null ? guestId.substring(0, 8) : "N/A") + ")";
    }
}
