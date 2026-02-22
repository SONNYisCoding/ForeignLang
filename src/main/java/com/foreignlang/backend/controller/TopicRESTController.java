package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.ContentStatus;
import com.foreignlang.backend.entity.Lesson;
import com.foreignlang.backend.entity.Topic;
import com.foreignlang.backend.repository.LessonRepository;
import com.foreignlang.backend.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/topics")
@RequiredArgsConstructor
public class TopicRESTController {

    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;

    @GetMapping
    @org.springframework.cache.annotation.Cacheable("topics")
    public ResponseEntity<List<Topic>> getAllTopics() {
        return ResponseEntity.ok(topicRepository.findAll());
    }

    /**
     * Get only APPROVED topics for learner-facing pages
     */
    @GetMapping("/published")
    public ResponseEntity<List<Topic>> getPublishedTopics() {
        return ResponseEntity.ok(topicRepository.findByStatus(ContentStatus.APPROVED));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable UUID id) {
        return topicRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/lessons")
    public ResponseEntity<List<Lesson>> getTopicLessons(@PathVariable UUID id) {
        return ResponseEntity.ok(lessonRepository.findByTopicIdOrderByOrderIndexAsc(id));
    }
}
