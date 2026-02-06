package com.foreignlang.backend.controller;

import com.foreignlang.backend.dto.TeacherStatsDTO;
import com.foreignlang.backend.entity.ContentStatus;
import com.foreignlang.backend.entity.Topic;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.TopicRepository;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.repository.StudentGroupRepository;
import com.foreignlang.backend.repository.GroupMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/teacher/topics")
@RequiredArgsConstructor
public class TeacherController {

    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final StudentGroupRepository studentGroupRepository;
    private final GroupMemberRepository groupMemberRepository;

    private User getAuthenticatedUser(OAuth2User principal, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String email = null;
        if (principal != null) {
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

    @GetMapping
    public ResponseEntity<?> getMyTopics(@AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        List<Map<String, Object>> result = topicRepository.findByAuthorId(user.getId()).stream().map(topic -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", topic.getId());
            map.put("title", topic.getTitle());
            map.put("description", topic.getDescription());
            map.put("difficulty", topic.getDifficultyLevel());
            map.put("status", topic.getStatus());
            map.put("lessonCount", topic.getLessons() != null ? topic.getLessons().size() : 0);
            map.put("updatedAt", topic.getSubmittedAt()); // using submittedAt as generic timestamp for now
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        long activeStudents = groupMemberRepository.countByGroup_Teacher_Id(user.getId());
        // long totalLessons = topicRepository.countByAuthorId(user.getId()); // Use if
        // needed

        return ResponseEntity.ok(TeacherStatsDTO.builder()
                .totalLearningHours(1240) // Placeholder
                .activeStudents(activeStudents)
                .completionRate(92.0) // Placeholder
                .avgScore(88.0) // Placeholder
                .build());
    }

    @PostMapping("/topics")
    public ResponseEntity<?> getMyGroups(@AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        List<Map<String, Object>> result = studentGroupRepository.findByTeacherId(user.getId()).stream().map(group -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", group.getId());
            map.put("name", group.getName());
            map.put("memberCount", group.getMembers() != null ? group.getMembers().size() : 0);
            // We can add list of students here if needed, or separate endpoint.
            // For now, let's include students for the "My Students" view
            List<Map<String, Object>> students = group.getMembers().stream().map(m -> {
                User u = m.getLearner();
                Map<String, Object> sMap = new HashMap<>();
                sMap.put("id", u.getId());
                sMap.put("name", u.getFullName() != null ? u.getFullName() : u.getEmail());
                sMap.put("email", u.getEmail());
                sMap.put("joinedAt", m.getJoinedAt());
                return sMap;
            }).collect(Collectors.toList());
            map.put("students", students);
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTopicDetails(@PathVariable UUID id,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        return topicRepository.findById(id).map(topic -> {
            if (!topic.getAuthor().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
            }
            return ResponseEntity.ok(topic); // Returns full graph including lessons if loaded
        }).map(r -> (ResponseEntity<?>) r).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createTopic(@RequestBody Topic request,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        request.setAuthor(user);
        request.setStatus(ContentStatus.DRAFT);
        // Ensure lessons link back if provided
        if (request.getLessons() != null) {
            request.getLessons().forEach(l -> l.setTopic(request));
        }

        Topic saved = topicRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateTopic(@PathVariable UUID id,
            @RequestBody Topic request,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        return topicRepository.findById(id).map(existing -> {
            if (!existing.getAuthor().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
            }

            existing.setTitle(request.getTitle());
            existing.setDescription(request.getDescription());
            existing.setDifficultyLevel(request.getDifficultyLevel());

            // Handle Lesson Updates (Naive Replace for now to minimize complexity, or
            // granular if ID provided)
            // For MVP, if lessons are sent, we might clear and re-add or merge.
            // Let's assume frontend sends full list.
            if (request.getLessons() != null) {
                existing.getLessons().clear();
                request.getLessons().forEach(l -> {
                    l.setTopic(existing);
                    existing.getLessons().add(l);
                });
            }

            Topic saved = topicRepository.save(existing);
            return ResponseEntity.ok(saved);
        }).map(r -> (ResponseEntity<?>) r).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/submit")
    @Transactional
    public ResponseEntity<?> submitTopic(@PathVariable UUID id,
            @AuthenticationPrincipal OAuth2User principal,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(principal, httpRequest);
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        return topicRepository.findById(id).map(topic -> {
            if (!topic.getAuthor().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
            }
            topic.setStatus(ContentStatus.PENDING_APPROVAL);
            topic.setSubmittedAt(LocalDateTime.now());
            topicRepository.save(topic);
            return ResponseEntity.ok(Map.of("success", true, "status", "PENDING_APPROVAL"));
        }).map(r -> (ResponseEntity<?>) r).orElse(ResponseEntity.notFound().build());
    }
}
