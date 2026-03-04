package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.Template;
import com.foreignlang.backend.repository.TemplateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/templates")
public class TemplateController {

    private final TemplateRepository templateRepository;

    public TemplateController(
            TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }


    @GetMapping
    public ResponseEntity<List<Template>> getAllTemplates() {
        return ResponseEntity.ok(templateRepository.findAll());
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<Template>> getTemplatesByTopic(@PathVariable UUID topicId) {
        return ResponseEntity.ok(templateRepository.findByTopicId(topicId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Template> getTemplateById(@PathVariable UUID id) {
        return templateRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
