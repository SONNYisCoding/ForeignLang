package com.foreignlang.backend.config;

import com.foreignlang.backend.entity.Lesson;
import com.foreignlang.backend.entity.Topic;
import com.foreignlang.backend.repository.LessonRepository;
import com.foreignlang.backend.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;

    @Override
    public void run(String... args) throws Exception {
        if (topicRepository.count() == 0) {
            // 1. Create Topics
            Topic t1 = Topic.builder()
                    .title("Business Email Writing")
                    .description("Learn how to write professional emails for job applications and daily work.")
                    .difficultyLevel(Topic.DifficultyLevel.BEGINNER)
                    .build();

            Topic t2 = Topic.builder()
                    .title("Effective Presentations")
                    .description("Master the art of public speaking and slide design.")
                    .difficultyLevel(Topic.DifficultyLevel.INTERMEDIATE)
                    .build();

            Topic t3 = Topic.builder()
                    .title("Negotiation Skills")
                    .description("Advanced vocabulary and tactics for business deals.")
                    .difficultyLevel(Topic.DifficultyLevel.ADVANCED)
                    .build();

            topicRepository.saveAll(List.of(t1, t2, t3));

            // 2. Create Lessons for "Business Email Writing"
            Lesson l1 = Lesson.builder()
                    .topic(t1)
                    .title("Formal vs Informal Greetings")
                    .contentBody("<h3>Understanding the Context</h3><p>In business, knowing when to use 'Dear Mr. Smith' versus 'Hi John' is crucial...</p>")
                    .orderIndex(1)
                    .build();

            Lesson l2 = Lesson.builder()
                    .topic(t1)
                    .title("Structuring a Request")
                    .contentBody("<h3>The 3-Part Structure</h3><p>1. The Opening<br>2. The Reason<br>3. The Call to Action</p>")
                    .orderIndex(2)
                    .build();

            // 3. Create Lessons for "Effective Presentations"
            Lesson l3 = Lesson.builder()
                    .topic(t2)
                    .title("Opening with a Hook")
                    .contentBody("<h3>Grab Their Attention</h3><p>Start with a surprising statistic, a quote, or a story.</p>")
                    .orderIndex(1)
                    .build();

            lessonRepository.saveAll(List.of(l1, l2, l3));
            
            System.out.println("Seeded Topics and Lessons into Database.");
        }
    }
}
