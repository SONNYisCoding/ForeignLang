package com.foreignlang.backend.repository;

import com.foreignlang.backend.entity.UserSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserSubmissionRepository extends JpaRepository<UserSubmission, UUID> {
    List<UserSubmission> findByUserId(UUID userId);
}
