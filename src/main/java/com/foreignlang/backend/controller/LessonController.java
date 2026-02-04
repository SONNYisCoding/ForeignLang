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
}
