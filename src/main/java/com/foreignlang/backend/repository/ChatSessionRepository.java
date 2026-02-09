package com.foreignlang.backend.repository;

import com.foreignlang.backend.entity.ChatSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {

    // Find active session for user
    Optional<ChatSession> findFirstByUserIdAndIsActiveTrueOrderByLastActivityDesc(UUID userId);

    // Find active session for guest
    Optional<ChatSession> findFirstByGuestIdAndIsActiveTrueOrderByLastActivityDesc(String guestId);

    // List all sessions for a user
    List<ChatSession> findByUserIdOrderByStartTimeDesc(UUID userId);

    // Admin: Find all sessions
    @Query("SELECT s FROM ChatSession s LEFT JOIN FETCH s.user ORDER BY s.lastActivity DESC")
    Page<ChatSession> findAllSessions(Pageable pageable);

    // Admin: Filter by user type (User ID is not null)
    Page<ChatSession> findByUserIdIsNotNull(Pageable pageable);

    // Admin: Filter by guest type (User ID is null)
    Page<ChatSession> findByUserIdIsNull(Pageable pageable);
}
