package com.foreignlang.backend.repository;

import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.entity.UserVocabulary;
import com.foreignlang.backend.entity.VocabularyBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserVocabularyRepository extends JpaRepository<UserVocabulary, UUID> {

    Optional<UserVocabulary> findByUserAndVocabulary(User user, VocabularyBank vocabulary);

    List<UserVocabulary> findByUserAndIsMasteredTrue(User user);

    long countByUserAndIsMasteredTrue(User user);

    @Query("SELECT uv.vocabulary.id FROM UserVocabulary uv WHERE uv.user = :user AND uv.isMastered = true")
    List<UUID> findMasteredVocabularyIdsByUser(User user);
}
