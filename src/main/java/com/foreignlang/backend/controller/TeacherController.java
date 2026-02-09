package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.TopicRepository;
import com.foreignlang.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/teachers")
public class TeacherController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TopicRepository topicRepository;

    @GetMapping("/{id}")
    @org.springframework.cache.annotation.Cacheable("teachers")
    public ResponseEntity<Map<String, Object>> getTeacherProfile(@PathVariable String id) {
        try {
            java.util.UUID userId = java.util.UUID.fromString(id);
            User user = userRepository.findById(userId).orElse(null);

            if (user == null || !user.getRoles().contains(User.Role.TEACHER)) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getFullName() != null ? user.getFullName() : "Teacher");
            response.put("email", user.getEmail()); // Maybe restrict public email? For now keep it.
            response.put("avatarUrl", user.getAvatarUrl());
            response.put("bio", user.getBio());
            response.put("specialization", user.getSpecialization());

            // Get public courses (topics) created by this teacher
            // Using APPROVED as the published status
            List<Map<String, Object>> courses = topicRepository.findByAuthorId(user.getId()).stream()
                    .filter(topic -> topic.getStatus() == com.foreignlang.backend.entity.ContentStatus.APPROVED)
                    .map(topic -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", topic.getId());
                        map.put("title", topic.getTitle());
                        map.put("description", topic.getDescription());
                        map.put("level", topic.getDifficultyLevel());
                        return map;
                    })
                    .collect(Collectors.toList());

            response.put("courses", courses);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
