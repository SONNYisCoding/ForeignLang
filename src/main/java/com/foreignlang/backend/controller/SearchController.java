package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.TopicRepository;
import com.foreignlang.backend.repository.TemplateRepository;
import com.foreignlang.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private TopicRepository topicRepository;

        @Autowired
        private TemplateRepository templateRepository;

        @GetMapping
        public ResponseEntity<Map<String, Object>> search(@RequestParam String query) {
                Map<String, Object> results = new HashMap<>();

                if (query == null || query.trim().isEmpty()) {
                        results.put("teachers", List.of());
                        results.put("courses", List.of());
                        results.put("features", List.of());
                        results.put("templates", List.of());
                        return ResponseEntity.ok(results);
                }

                String searchTerm = query.toLowerCase();

                // 1. Search Teachers
                List<Map<String, String>> teachers = userRepository.findAll().stream()
                                .filter(user -> user.getRoles() != null && user.getRoles().contains(User.Role.TEACHER))
                                .filter(user -> (user.getFullName() != null
                                                && user.getFullName().toLowerCase().contains(searchTerm)) ||
                                                (user.getEmail() != null
                                                                && user.getEmail().toLowerCase().contains(searchTerm)))
                                .limit(5)
                                .map(user -> Map.of(
                                                "id", String.valueOf(user.getId()),
                                                "title",
                                                user.getFullName() != null ? user.getFullName() : user.getEmail(),
                                                "type", "Teacher",
                                                "path", "/teachers/" + user.getId()))
                                .collect(Collectors.toList());

                results.put("teachers", teachers);

                // 2. Search Topics (as Courses)
                List<Map<String, String>> courses = topicRepository.findAll().stream()
                                .filter(topic -> topic.getTitle() != null
                                                && topic.getTitle().toLowerCase().contains(searchTerm))
                                .limit(5)
                                .map(topic -> Map.of(
                                                "id", String.valueOf(topic.getId()),
                                                "title", topic.getTitle(),
                                                "type", "Course",
                                                "path", "/courses/" + topic.getId()))
                                .collect(Collectors.toList());

                results.put("courses", courses);

                // 3. Search Templates
                List<Map<String, String>> templates = templateRepository.findAll().stream()
                                .filter(template -> template.getName() != null
                                                && template.getName().toLowerCase().contains(searchTerm))
                                .limit(5)
                                .map(template -> Map.of(
                                                "id", String.valueOf(template.getId()),
                                                "title", template.getName(),
                                                "type", "Template",
                                                "path", "/templates/" + template.getId()))
                                .collect(Collectors.toList());

                results.put("templates", templates);

                // 4. Search Features (Static list)
                List<Map<String, String>> features = new ArrayList<>();
                List<Map<String, String>> allFeatures = List.of(
                                Map.of("id", "gen", "title", "AI Email Generator", "type", "Feature", "path",
                                                "/dashboard/generator"),
                                Map.of("id", "hist", "title", "History", "type", "Feature", "path",
                                                "/dashboard/history"),
                                Map.of("id", "dash", "title", "Dashboard", "type", "Navigation", "path", "/dashboard"));

                for (Map<String, String> item : allFeatures) {
                        if (item.get("title").toLowerCase().contains(searchTerm)) {
                                features.add(item);
                        }
                }

                results.put("features", features);

                return ResponseEntity.ok(results);
        }
}
