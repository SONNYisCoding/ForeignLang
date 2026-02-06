package com.foreignlang.backend.repository;

import com.foreignlang.backend.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
    void deleteByGroupIdAndLearnerId(UUID groupId, UUID learnerId);

    boolean existsByGroupIdAndLearnerId(UUID groupId, UUID learnerId);

    long countByGroup_Teacher_Id(UUID teacherId);
}
