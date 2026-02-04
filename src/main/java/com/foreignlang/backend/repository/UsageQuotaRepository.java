package com.foreignlang.backend.repository;

import com.foreignlang.backend.entity.UsageQuota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsageQuotaRepository extends JpaRepository<UsageQuota, UUID> {
    Optional<UsageQuota> findByUserId(UUID userId);
}
