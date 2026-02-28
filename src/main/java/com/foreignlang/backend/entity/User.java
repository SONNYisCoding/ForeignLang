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

    @Column(name = "avatar_url", length = 1024)
    private String avatarUrl;

    @Column(name = "google_id", unique = true)
    private String googleId; // Google OAuth sub ID

    @Column(name = "facebook_id", unique = true)
    private String facebookId; // Facebook OAuth ID

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String specialization;

    @Column(name = "learning_goal")
    private String learningGoal;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false)
    @Builder.Default
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Column(name = "profile_complete", nullable = false)
    @Builder.Default
    private boolean profileComplete = false;

    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    @Builder.Default
    private java.util.Set<Role> roles = new java.util.HashSet<>(java.util.Set.of(Role.GUEST));

    @Column(name = "items_generated", nullable = false, columnDefinition = "integer default 0")
    @Builder.Default
    private int emailsGenerated = 0;

    @Column(name = "streak_days", nullable = false, columnDefinition = "integer default 0")
    @Builder.Default
    private int streakDays = 0;

    @Column(name = "last_activity_date")
    private LocalDate lastActivityDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_tier", nullable = false)
    @Builder.Default
    private SubscriptionTier subscriptionTier = SubscriptionTier.FREE;

    @Column(name = "subscription_expiry_date")
    private LocalDateTime subscriptionExpiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "proficiency_level")
    private ProficiencyLevel proficiencyLevel;

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
        FACEBOOK, // Facebook OAuth only
        BOTH, // Linked accounts (Local + Google, Local + Facebook)
        MULTIPLE // All formats
    }
}
