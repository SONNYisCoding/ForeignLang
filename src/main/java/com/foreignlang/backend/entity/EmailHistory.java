package com.foreignlang.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "email_history", indexes = {
        @Index(name = "idx_email_created_at", columnList = "createdAt"),
        @Index(name = "idx_email_type", columnList = "emailType")
})
@Getter
@Setter
@NoArgsConstructor
public class EmailHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(columnDefinition = "TEXT")
    private String prompt;

    private String tone;
    private String language;
    private String emailType;
    private String recipientType;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public EmailHistory(User user, String subject, String body, String prompt,
            String tone, String language, String emailType, String recipientType) {
        this.user = user;
        this.subject = subject;
        this.body = body;
        this.prompt = prompt;
        this.tone = tone;
        this.language = language;
        this.emailType = emailType;
        this.recipientType = recipientType;
    }
}
