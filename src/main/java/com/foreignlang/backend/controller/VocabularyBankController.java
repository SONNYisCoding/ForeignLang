package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.VocabularyBank;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.entity.UserVocabulary;
import com.foreignlang.backend.repository.VocabularyBankRepository;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.repository.UserVocabularyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * REST Controller for VocabularyBank CRUD operations.
 * Part of the CMS module for Admin content management.
 */
@RestController
@RequestMapping("/api/v1/vocabulary")
public class VocabularyBankController {

    private final VocabularyBankRepository vocabularyBankRepository;
    private final UserRepository userRepository;
    private final UserVocabularyRepository userVocabularyRepository;

    public VocabularyBankController(
            VocabularyBankRepository vocabularyBankRepository,
            UserRepository userRepository,
            UserVocabularyRepository userVocabularyRepository) {
        this.vocabularyBankRepository = vocabularyBankRepository;
        this.userRepository = userRepository;
        this.userVocabularyRepository = userVocabularyRepository;
    }


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

    /**
     * Mark a vocabulary entry as mastered by the current user
     */
    @PostMapping("/{id}/master")
    public ResponseEntity<?> masterVocabulary(@PathVariable UUID id,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {

        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Optional<VocabularyBank> vocabOpt = vocabularyBankRepository.findById(id);
        if (vocabOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        VocabularyBank vocab = vocabOpt.get();

        UserVocabulary userVocab = userVocabularyRepository.findByUserAndVocabulary(user, vocab)
                .orElse(UserVocabulary.builder()
                        .user(user)
                        .vocabulary(vocab)
                        .isMastered(false)
                        .build());

        // Toggle mastery or just set to true (for now just toggle)
        userVocab.setMastered(!userVocab.isMastered());
        userVocabularyRepository.save(userVocab);

        return ResponseEntity.ok(Map.of("isMastered", userVocab.isMastered(), "vocabularyId", id));
    }

    /**
     * Get IDs of all vocabulary mastered by the current user
     */
    @GetMapping("/mastered")
    public ResponseEntity<?> getMasteredVocabularyIds(@AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {

        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        List<UUID> masteredIds = userVocabularyRepository.findMasteredVocabularyIdsByUser(user);
        return ResponseEntity.ok(masteredIds);
    }

    private User getAuthenticatedUser(OAuth2User principal, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String email = null;
        if (principal instanceof com.foreignlang.backend.security.UserPrincipal userPrincipal) {
            return userPrincipal.getUser();
        } else if (principal != null) {
            email = principal.getAttribute("email");
        } else {
            jakarta.servlet.http.HttpSession session = httpRequest.getSession(false);
            if (session != null) {
                email = (String) session.getAttribute("userEmail");
            }
        }
        if (email == null)
            return null;
        return userRepository.findByEmail(email).orElse(null);
    }
}
