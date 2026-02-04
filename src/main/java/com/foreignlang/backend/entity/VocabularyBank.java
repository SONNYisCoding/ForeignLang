package com.foreignlang.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * VocabularyBank - Stores key vocabulary terms linked to learning topics.
 * Part of the CMS (Content Management System) module.
 */
@Entity
@Table(name = "vocabulary_bank")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VocabularyBank {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Topic topic;

    @Column(nullable = false)
    private String term;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String definition;

    @Column(name = "example_sentence", columnDefinition = "TEXT")
    private String exampleSentence;

    @Column(name = "pronunciation")
    private String pronunciation;

    @Enumerated(EnumType.STRING)
    @Column(name = "part_of_speech")
    private PartOfSpeech partOfSpeech;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum PartOfSpeech {
        NOUN, VERB, ADJECTIVE, ADVERB, PREPOSITION, CONJUNCTION, PHRASE
    }
}
