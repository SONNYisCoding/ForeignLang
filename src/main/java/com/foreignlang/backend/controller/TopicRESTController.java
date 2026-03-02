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

    @PostMapping
    public ResponseEntity<Topic> createTopic(@RequestBody Topic topic) {
        return ResponseEntity.ok(topicRepository.save(topic));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Topic> updateTopic(@PathVariable UUID id, @RequestBody Topic topicDetails) {
        return topicRepository.findById(id).map(topic -> {
            topic.setTitle(topicDetails.getTitle());
            topic.setDescription(topicDetails.getDescription());
            topic.setDifficultyLevel(topicDetails.getDifficultyLevel());
            if (topicDetails.getStatus() != null) {
                topic.setStatus(topicDetails.getStatus());
            }
            return ResponseEntity.ok(topicRepository.save(topic));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable UUID id) {
        return topicRepository.findById(id).map(topic -> {
            topicRepository.delete(topic);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
