package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.Lesson;
import com.foreignlang.backend.entity.Topic;
import com.foreignlang.backend.repository.LessonRepository;
import com.foreignlang.backend.repository.TopicRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/lessons")
public class LessonWebController {

    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;

    public LessonWebController(
            TopicRepository topicRepository,
            LessonRepository lessonRepository) {
        this.topicRepository = topicRepository;
        this.lessonRepository = lessonRepository;
    }


    @GetMapping("/topic/{topicId}")
    public String listLessons(@PathVariable UUID topicId, Model model) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid topic Id:" + topicId));
        
        List<Lesson> lessons = lessonRepository.findByTopicIdOrderByOrderIndexAsc(topicId);
        
        model.addAttribute("topic", topic);
        model.addAttribute("lessons", lessons);
        return "lesson_list";
    }

    @GetMapping("/{lessonId}")
    public String viewLesson(@PathVariable UUID lessonId, Model model) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid lesson Id:" + lessonId));
        
        model.addAttribute("lesson", lesson);
        return "lesson_detail";
    }
}
