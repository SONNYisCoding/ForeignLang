package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.GroupMember;
import com.foreignlang.backend.entity.StudentGroup;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.GroupMemberRepository;
import com.foreignlang.backend.repository.StudentGroupRepository;
import com.foreignlang.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/groups")
@RequiredArgsConstructor
public class GroupController {

    private final StudentGroupRepository groupRepository;
    private final GroupMemberRepository memberRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllGroups() {
        List<Map<String, Object>> result = groupRepository.findAllWithDetails().stream().map(group -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", group.getId());
            map.put("name", group.getName());
            map.put("description", group.getDescription() != null ? group.getDescription() : "");
            map.put("teacherName", group.getTeacher().getFullName() != null ? group.getTeacher().getFullName()
                    : group.getTeacher().getEmail());
            map.put("memberCount", group.getMembers() != null ? group.getMembers().size() : 0);
            map.put("createdAt", group.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createGroup(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String teacherIdStr = request.get("teacherId");
        String description = request.get("description");

        if (name == null || teacherIdStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name and Teacher ID are required"));
        }

        UUID teacherId;
        try {
            teacherId = UUID.fromString(teacherIdStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid Teacher ID"));
        }

        User teacher = userRepository.findById(teacherId).orElse(null);
        if (teacher == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Teacher not found"));
        }

        StudentGroup group = StudentGroup.builder()
                .name(name)
                .description(description)
                .teacher(teacher)
                .build();
        groupRepository.save(group);
        return ResponseEntity.ok(group);
    }

    @PostMapping("/{groupId}/members")
    @Transactional
    public ResponseEntity<?> addMember(@PathVariable UUID groupId, @RequestBody Map<String, String> request) {
        String learnerIdStr = request.get("learnerId");
        if (learnerIdStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Learner ID is required"));
        }

        UUID learnerId;
        try {
            learnerId = UUID.fromString(learnerIdStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid Learner ID"));
        }

        if (memberRepository.existsByGroupIdAndLearnerId(groupId, learnerId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Learner already in group"));
        }

        StudentGroup group = groupRepository.findById(groupId).orElse(null);
        if (group == null) {
            return ResponseEntity.notFound().build();
        }

        User learner = userRepository.findById(learnerId).orElse(null);
        if (learner == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Learner not found"));
        }

        GroupMember member = GroupMember.builder()
                .group(group)
                .learner(learner)
                .build();
        memberRepository.save(member);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
