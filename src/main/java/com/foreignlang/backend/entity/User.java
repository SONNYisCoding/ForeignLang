package com.foreignlang.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash; // BCrypt hashed, null for OAuth-only users

    @Column(unique = true)
    private String username; // Unique handle

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "google_id", unique = true)
    private String googleId; // Google OAuth sub ID

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false)
    @Builder.Default
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Column(name = "profile_complete", nullable = false)
    @Builder.Default
    private boolean profileComplete = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.GUEST;

    @Column(name = "items_generated", nullable = false, columnDefinition = "integer default 0")
    @Builder.Default
    private int emailsGenerated = 0;

    @Column(name = "streak_days", nullable = false, columnDefinition = "integer default 0")
    @Builder.Default
    private int streakDays = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_tier", nullable = false)
    @Builder.Default
    private SubscriptionTier subscriptionTier = SubscriptionTier.FREE;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UsageQuota usageQuota;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Role {
        GUEST, LEARNER, TEACHER, ADMIN
    }

    public enum SubscriptionTier {
        FREE, PREMIUM
    }

    public enum AuthProvider {
        LOCAL, // Email/password registration
        GOOGLE, // Google OAuth only
        BOTH // Linked accounts
    }
}
