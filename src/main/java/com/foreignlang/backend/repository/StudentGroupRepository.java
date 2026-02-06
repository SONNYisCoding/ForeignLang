package com.foreignlang.backend.repository;

import com.foreignlang.backend.entity.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentGroupRepository extends JpaRepository<StudentGroup, UUID> {
    List<StudentGroup> findByTeacherId(UUID teacherId);

    @Query("SELECT g FROM StudentGroup g JOIN FETCH g.teacher LEFT JOIN FETCH g.members")
    List<StudentGroup> findAllWithDetails();

}
