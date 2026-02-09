package com.foreignlang.backend.seeder;

import com.foreignlang.backend.entity.*;
import com.foreignlang.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
// @Profile("!prod") // Optional: Only run in non-prod environments if desired
public class ContentDataSeeder implements CommandLineRunner {

        private final TopicRepository topicRepository;
        private final LessonRepository lessonRepository;
        private final VocabularyBankRepository vocabularyBankRepository;
        private final TemplateRepository templateRepository;

        @Override
        public void run(String... args) throws Exception {
                if (topicRepository.count() > 0) {
                        log.info("Data already seeded, skipping...");
                        return;
                }

                log.info("Seeding data...");
                seedBusinessCommunication();
                seedTravelEssentials();
                seedDailyLife();
                log.info("Data seeding completed.");
        }

        private void seedBusinessCommunication() {
                Topic topic = Topic.builder()
                                .title("Business Communication")
                                .description("Master the art of professional communication in the workplace.")
                                .difficultyLevel(Topic.DifficultyLevel.INTERMEDIATE)
                                .status(ContentStatus.APPROVED)
                                .build();
                topic = topicRepository.save(topic);

                // Lessons
                Lesson l1 = Lesson.builder()
                                .topic(topic)
                                .title("Writing Formal Emails")
                                .orderIndex(1)
                                .contentBody(
                                                "<h2>Introduction to Formal Emails</h2><p>Formal emails are essential for professional communication. Always start with a clear subject line.</p><h3>Key Phrases:</h3><ul><li>I am writing to enquire about...</li><li>Please find attached...</li><li>I look forward to hearing from you.</li></ul>")
                                .build();

                Lesson l2 = Lesson.builder()
                                .topic(topic)
                                .title("Business Meetings 101")
                                .orderIndex(2)
                                .contentBody(
                                                "<h2>Conducting Effective Meetings</h2><p>Learn how to set an agenda, facilitate discussion, and follow up with meeting minutes.</p>")
                                .build();
                lessonRepository.saveAll(List.of(l1, l2));

                // Vocabulary
                VocabularyBank v1 = VocabularyBank.builder()
                                .topic(topic)
                                .term("Negotiation")
                                .definition("Discussion aimed at reaching an agreement.")
                                .exampleSentence("The salary negotiation took two hours.")
                                .pronunciation("/ˌnɛɡoʊʃiˈeɪʃən/")
                                .partOfSpeech(VocabularyBank.PartOfSpeech.NOUN)
                                .build();

                VocabularyBank v2 = VocabularyBank.builder()
                                .topic(topic)
                                .term("Deadline")
                                .definition("The latest updated time or date by which something should be completed.")
                                .exampleSentence("We must meet the deadline for this project.")
                                .pronunciation("/ˈdɛdlaɪn/")
                                .partOfSpeech(VocabularyBank.PartOfSpeech.NOUN)
                                .build();
                vocabularyBankRepository.saveAll(List.of(v1, v2));

                // Templates
                Template t1 = Template.builder()
                                .topic(topic)
                                .name("Formal Project Update")
                                .structure(
                                                "Subject: Project Update - [Project Name]\n\nDear [Name],\n\nI am writing to provide an update on [Project Name]. We have successfully completed [Milestone].\n\nOur next steps are [Next Steps].\n\nBest regards,\n[Your Name]")
                                .build();
                templateRepository.save(t1);
        }

        private void seedTravelEssentials() {
                Topic topic = Topic.builder()
                                .title("Travel Essentials")
                                .description("Everything you need to know for your next international trip.")
                                .difficultyLevel(Topic.DifficultyLevel.BEGINNER)
                                .status(ContentStatus.APPROVED)
                                .build();
                topic = topicRepository.save(topic);

                // Lessons
                Lesson l1 = Lesson.builder()
                                .topic(topic)
                                .title("At the Airport")
                                .orderIndex(1)
                                .contentBody(
                                                "<h2>Navigating the Airport</h2><p>Learn how to check in, go through security, and find your gate.</p>")
                                .build();
                lessonRepository.save(l1);

                // Vocabulary
                VocabularyBank v1 = VocabularyBank.builder()
                                .topic(topic)
                                .term("Itinerary")
                                .definition("A planned route or journey.")
                                .exampleSentence("I need to print my flight itinerary.")
                                .pronunciation("/aɪˈtɪnərəri/")
                                .partOfSpeech(VocabularyBank.PartOfSpeech.NOUN)
                                .build();
                vocabularyBankRepository.save(v1);

                // Template
                Template t1 = Template.builder()
                                .topic(topic)
                                .name("Hotel Booking Inquiry")
                                .structure(
                                                "Subject: Booking Inquiry for [Dates]\n\nDear Reservations Team,\n\nI would like to inquire about room availability for [Number] guests from [Check-in Date] to [Check-out Date].\n\nDo you have any ocean-view rooms available?\n\nSincerely,\n[Your Name]")
                                .build();
                templateRepository.save(t1);
        }

        private void seedDailyLife() {
                Topic topic = Topic.builder()
                                .title("Daily Life & Operations")
                                .description("Common phrases and scenarios for everyday living.")
                                .difficultyLevel(Topic.DifficultyLevel.BEGINNER)
                                .status(ContentStatus.APPROVED)
                                .build();
                topic = topicRepository.save(topic);

                Lesson l1 = Lesson.builder()
                                .topic(topic)
                                .title("Ordering at a Restaurant")
                                .orderIndex(1)
                                .contentBody("<h2>Ordering Food</h2><p>Key phrases for ordering food and asking for the bill.</p>")
                                .build();
                lessonRepository.save(l1);

                VocabularyBank v1 = VocabularyBank.builder()
                                .topic(topic)
                                .term("Recommend")
                                .definition("To suggest something as being good or suitable.")
                                .exampleSentence("What do you recommend from the menu?")
                                .pronunciation("/ˌrɛkəˈmɛnd/")
                                .partOfSpeech(VocabularyBank.PartOfSpeech.VERB)
                                .build();
                vocabularyBankRepository.save(v1);
        }
}
