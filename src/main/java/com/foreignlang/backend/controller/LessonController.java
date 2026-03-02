package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.Lesson;
import com.foreignlang.backend.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonRepository lessonRepository;
    private final com.foreignlang.backend.repository.TopicRepository topicRepository;

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<Lesson>> getLessonsByTopic(@PathVariable UUID topicId) {
        return ResponseEntity.ok(lessonRepository.findByTopicIdOrderByOrderIndexAsc(topicId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable UUID id) {
        return lessonRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/topic/{topicId}")
    public ResponseEntity<Lesson> createLesson(@PathVariable UUID topicId, @RequestBody Lesson lesson) {
        return topicRepository.findById(topicId).map(topic -> {
            lesson.setTopic(topic);
            return ResponseEntity.ok(lessonRepository.save(lesson));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lesson> updateLesson(@PathVariable UUID id, @RequestBody Lesson lessonDetails) {
        return lessonRepository.findById(id).map(lesson -> {
            lesson.setTitle(lessonDetails.getTitle());
            lesson.setContentBody(lessonDetails.getContentBody());
            lesson.setOrderIndex(lessonDetails.getOrderIndex());
            return ResponseEntity.ok(lessonRepository.save(lesson));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable UUID id) {
        return lessonRepository.findById(id).map(lesson -> {
            lessonRepository.delete(lesson);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
