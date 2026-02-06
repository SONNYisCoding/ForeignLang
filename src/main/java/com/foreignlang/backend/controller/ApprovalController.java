package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.ContentStatus;

import com.foreignlang.backend.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final TopicRepository topicRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getPendingApprovals() {
        List<Map<String, Object>> result = topicRepository.findByStatus(ContentStatus.PENDING_APPROVAL).stream()
                .map(topic -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", topic.getId());
                    map.put("title", topic.getTitle());
                    map.put("description", topic.getDescription());
                    map.put("authorName", topic.getAuthor() != null ? topic.getAuthor().getFullName() : "Unknown");
                    map.put("submittedAt", topic.getSubmittedAt());
                    map.put("difficulty", topic.getDifficultyLevel());
                    return map;
                }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/approve")
    @Transactional
    public ResponseEntity<?> approveTopic(@PathVariable UUID id) {
        return topicRepository.findById(id).map(topic -> {
            topic.setStatus(ContentStatus.APPROVED);
            topic.setApprovedAt(LocalDateTime.now());
            topicRepository.save(topic);
            return ResponseEntity.ok(Map.of("success", true, "status", "APPROVED"));
        }).map(r -> (ResponseEntity<?>) r)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    @Transactional
    public ResponseEntity<?> rejectTopic(@PathVariable UUID id) {
        return topicRepository.findById(id).map(topic -> {
            topic.setStatus(ContentStatus.REJECTED);
            topicRepository.save(topic); // Reviewed but rejected
            return ResponseEntity.ok(Map.of("success", true, "status", "REJECTED"));
        }).map(r -> (ResponseEntity<?>) r)
                .orElse(ResponseEntity.notFound().build());
    }
}
