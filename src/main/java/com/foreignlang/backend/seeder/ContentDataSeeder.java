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
                // Check vocabulary count instead of topic — DataSeeder (dev profile)
                // seeds topics separately, which would cause this seeder to skip its own data.
                if (vocabularyBankRepository.count() > 0) {
                        log.info("Content data already seeded, skipping...");
                        return;
                }

                log.info("Seeding data...");
                seedBusinessCommunication(); // Data cũ của Bond
                seedTravelEssentials(); // Data cũ của Bond
                seedDailyLife(); // Data cũ của Bond

                seedSoftwareEngineering(); // NEW: Data IT và Email Template xịn của sếp
                log.info("Data seeding completed.");
        }

        // ==========================================
        // DỮ LIỆU CŨ CỦA BOND (GIỮ NGUYÊN 100%)
        // ==========================================
        private void seedBusinessCommunication() {
                Topic topic = Topic.builder()
                                .title("Business Communication")
                                .description("Master the art of professional communication in the workplace.")
                                .difficultyLevel(Topic.DifficultyLevel.INTERMEDIATE)
                                .status(ContentStatus.APPROVED)
                                .build();
                topic = topicRepository.save(topic);

                Lesson l1 = Lesson.builder()
                                .topic(topic)
                                .title("Writing Formal Emails")
                                .orderIndex(1)
                                .contentBody("<h2>Introduction to Formal Emails</h2><p>Formal emails are essential for professional communication. Always start with a clear subject line.</p><h3>Key Phrases:</h3><ul><li>I am writing to enquire about...</li><li>Please find attached...</li><li>I look forward to hearing from you.</li></ul>")
                                .build();

                Lesson l2 = Lesson.builder()
                                .topic(topic)
                                .title("Business Meetings 101")
                                .orderIndex(2)
                                .contentBody("<h2>Conducting Effective Meetings</h2><p>Learn how to set an agenda, facilitate discussion, and follow up with meeting minutes.</p>")
                                .build();
                lessonRepository.saveAll(List.of(l1, l2));

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

                Template t1 = Template.builder()
                                .topic(topic)
                                .name("Formal Project Update")
                                .structure("Subject: Project Update - [Project Name]\n\nDear [Name],\n\nI am writing to provide an update on [Project Name]. We have successfully completed [Milestone].\n\nOur next steps are [Next Steps].\n\nBest regards,\n[Your Name]")
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

                Lesson l1 = Lesson.builder()
                                .topic(topic)
                                .title("At the Airport")
                                .orderIndex(1)
                                .contentBody("<h2>Navigating the Airport</h2><p>Learn how to check in, go through security, and find your gate.</p>")
                                .build();
                lessonRepository.save(l1);

                VocabularyBank v1 = VocabularyBank.builder()
                                .topic(topic)
                                .term("Itinerary")
                                .definition("A planned route or journey.")
                                .exampleSentence("I need to print my flight itinerary.")
                                .pronunciation("/aɪˈtɪnərəri/")
                                .partOfSpeech(VocabularyBank.PartOfSpeech.NOUN)
                                .build();
                vocabularyBankRepository.save(v1);

                Template t1 = Template.builder()
                                .topic(topic)
                                .name("Hotel Booking Inquiry")
                                .structure("Subject: Booking Inquiry for [Dates]\n\nDear Reservations Team,\n\nI would like to inquire about room availability for [Number] guests from [Check-in Date] to [Check-out Date].\n\nDo you have any ocean-view rooms available?\n\nSincerely,\n[Your Name]")
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

        // ==========================================
        // DỮ LIỆU MỚI THÊM VÀO (IT & SOFTWARE ENGINEERING)
        // ==========================================
        private void seedSoftwareEngineering() {
                Topic topic = Topic.builder()
                                .title("Software Engineering")
                                .description("Master professional communication in Agile teams and tech environments.")
                                .difficultyLevel(Topic.DifficultyLevel.INTERMEDIATE)
                                .status(ContentStatus.APPROVED)
                                .build();
                topic = topicRepository.save(topic);

                Lesson l1 = Lesson.builder()
                                .topic(topic)
                                .title("Daily Stand-up & Blockers")
                                .orderIndex(1)
                                .contentBody("<h2>Reporting in Agile</h2><p>Learn how to concisely report your progress and blockers in daily Scrum meetings.</p>")
                                .build();
                lessonRepository.save(l1);

                VocabularyBank v1 = VocabularyBank.builder()
                                .topic(topic)
                                .term("Refactor")
                                .definition("To restructure existing computer code without changing its external behavior.")
                                .exampleSentence(
                                                "We need to refactor the authentication module to improve performance.")
                                .pronunciation("/ˌriːˈfæktər/")
                                .partOfSpeech(VocabularyBank.PartOfSpeech.VERB)
                                .build();

                VocabularyBank v2 = VocabularyBank.builder()
                                .topic(topic)
                                .term("Bottleneck")
                                .definition("A point of congestion in a system that slows down the overall process.")
                                .exampleSentence("The database query is the main bottleneck in our current sprint.")
                                .pronunciation("/ˈbɑːtlnek/")
                                .partOfSpeech(VocabularyBank.PartOfSpeech.NOUN)
                                .build();

                VocabularyBank v3 = VocabularyBank.builder()
                                .topic(topic)
                                .term("Deprecate")
                                .definition("To discourage the use of a software feature, usually because it has been superseded.")
                                .exampleSentence("The old API endpoint will be deprecated in the next major release.")
                                .pronunciation("/ˈdeprəkeɪt/")
                                .partOfSpeech(VocabularyBank.PartOfSpeech.VERB)
                                .build();
                vocabularyBankRepository.saveAll(List.of(v1, v2, v3));

                // Templates dạng JSON Form cho Frontend bóc tách
                String sickLeaveJson = "{" +
                                "\"lockedPreview\": \"Dear [Manager], Please accept this email as formal notification that I will be taking sick leave today. I have handed over my pending pull requests to...\", "
                                +
                                "\"unlockedForm\": {" +
                                "\"fields\": [" +
                                "{\"name\": \"managerName\", \"placeholder\": \"Manager's Name\"}," +
                                "{\"name\": \"date\", \"placeholder\": \"Date (e.g., today, tomorrow)\"}," +
                                "{\"name\": \"handoverPerson\", \"placeholder\": \"Colleague taking over\"}" +
                                "]," +
                                "\"templateBody\": \"Dear {{managerName}},\\n\\nPlease accept this email as formal notification that I am unwell and will be taking sick leave {{date}}. I have handed over my pending tasks to {{handoverPerson}}.\""
                                +
                                "}" +
                                "}";

                Template t1 = Template.builder()
                                .topic(topic)
                                .name("Sick Leave Request (IT Project)")
                                .structure(sickLeaveJson)
                                .build();

                String deadlineJson = "{" +
                                "\"lockedPreview\": \"Hi team, I am writing to request a short extension for the current ticket due to unexpected API rate limits. I anticipate completing it by...\", "
                                +
                                "\"unlockedForm\": {" +
                                "\"fields\": [" +
                                "{\"name\": \"ticketName\", \"placeholder\": \"Ticket Name\"}," +
                                "{\"name\": \"blockerReason\", \"placeholder\": \"Technical Blocker\"}," +
                                "{\"name\": \"newDate\", \"placeholder\": \"Proposed Date\"}" +
                                "]," +
                                "\"templateBody\": \"Hi team,\\n\\nI am writing to request a brief extension for {{ticketName}}. We encountered unexpected issues with {{blockerReason}}. I am actively resolving it and anticipate pushing the commit by {{newDate}}.\""
                                +
                                "}" +
                                "}";

                Template t2 = Template.builder()
                                .topic(topic)
                                .name("Deadline Extension (Sprint Delay)")
                                .structure(deadlineJson)
                                .build();

                templateRepository.saveAll(List.of(t1, t2));
        }
}