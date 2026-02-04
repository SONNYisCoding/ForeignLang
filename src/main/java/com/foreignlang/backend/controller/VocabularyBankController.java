package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.VocabularyBank;
import com.foreignlang.backend.repository.VocabularyBankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for VocabularyBank CRUD operations.
 * Part of the CMS module for Admin content management.
 */
@RestController
@RequestMapping("/api/v1/vocabulary")
@RequiredArgsConstructor
public class VocabularyBankController {

    private final VocabularyBankRepository vocabularyBankRepository;

    /**
     * Get all vocabulary for a specific topic
     */
    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<VocabularyBank>> getVocabularyByTopic(@PathVariable UUID topicId) {
        List<VocabularyBank> vocabulary = vocabularyBankRepository.findByTopicIdOrderByTermAsc(topicId);
        return ResponseEntity.ok(vocabulary);
    }

    /**
     * Search vocabulary by term (partial match)
     */
    @GetMapping("/search")
    public ResponseEntity<List<VocabularyBank>> searchVocabulary(@RequestParam String term) {
        List<VocabularyBank> results = vocabularyBankRepository.findByTermContainingIgnoreCase(term);
        return ResponseEntity.ok(results);
    }

    /**
     * Get vocabulary by part of speech
     */
    @GetMapping("/pos/{partOfSpeech}")
    public ResponseEntity<List<VocabularyBank>> getByPartOfSpeech(
            @PathVariable VocabularyBank.PartOfSpeech partOfSpeech) {
        List<VocabularyBank> vocabulary = vocabularyBankRepository.findByPartOfSpeech(partOfSpeech);
        return ResponseEntity.ok(vocabulary);
    }

    /**
     * Get a single vocabulary entry by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<VocabularyBank> getVocabularyById(@PathVariable UUID id) {
        return vocabularyBankRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new vocabulary entry (Admin only in production)
     */
    @PostMapping
    public ResponseEntity<VocabularyBank> createVocabulary(@RequestBody VocabularyBank vocabulary) {
        VocabularyBank saved = vocabularyBankRepository.save(vocabulary);
        return ResponseEntity.ok(saved);
    }

    /**
     * Update a vocabulary entry (Admin only in production)
     */
    @PutMapping("/{id}")
    public ResponseEntity<VocabularyBank> updateVocabulary(
            @PathVariable UUID id,
            @RequestBody VocabularyBank vocabulary) {
        return vocabularyBankRepository.findById(id)
                .map(existing -> {
                    existing.setTerm(vocabulary.getTerm());
                    existing.setDefinition(vocabulary.getDefinition());
                    existing.setExampleSentence(vocabulary.getExampleSentence());
                    existing.setPronunciation(vocabulary.getPronunciation());
                    existing.setPartOfSpeech(vocabulary.getPartOfSpeech());
                    return ResponseEntity.ok(vocabularyBankRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a vocabulary entry (Admin only in production)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVocabulary(@PathVariable UUID id) {
        if (vocabularyBankRepository.existsById(id)) {
            vocabularyBankRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
