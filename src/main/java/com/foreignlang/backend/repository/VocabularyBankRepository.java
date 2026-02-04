package com.foreignlang.backend.repository;

import com.foreignlang.backend.entity.VocabularyBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VocabularyBankRepository extends JpaRepository<VocabularyBank, UUID> {

    List<VocabularyBank> findByTopicId(UUID topicId);

    List<VocabularyBank> findByTopicIdOrderByTermAsc(UUID topicId);

    List<VocabularyBank> findByTermContainingIgnoreCase(String term);

    List<VocabularyBank> findByPartOfSpeech(VocabularyBank.PartOfSpeech partOfSpeech);
}
