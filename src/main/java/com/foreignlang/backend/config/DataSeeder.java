package com.foreignlang.backend.config;

import com.foreignlang.backend.entity.*;
import com.foreignlang.backend.repository.LessonRepository;
import com.foreignlang.backend.repository.TopicRepository;
import com.foreignlang.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
@org.springframework.context.annotation.Profile("dev")
public class DataSeeder {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final TopicRepository topicRepository;
        private final LessonRepository lessonRepository;

        @Bean
        public CommandLineRunner initData() {
                return args -> {
                        seedAdminUser();
                        seedTeacherUser();
                        seedTopicsAndLessons();
                };
        }

        private void seedAdminUser() {
                String adminEmail = "admin@foreignlang.com";
                String adminUsername = "admin";
                try {
                        var existingAdminOpt = userRepository.findByEmail(adminEmail);
                        if (existingAdminOpt.isPresent()) {
                                User admin = existingAdminOpt.get();
                                if (!admin.getRoles().contains(User.Role.ADMIN)) {
                                        admin.getRoles().add(User.Role.ADMIN);
                                        userRepository.save(admin);
                                        log.info("Updated existing admin user role to ADMIN");
                                }
                                return;
                        }
                        if (userRepository.findByUsername(adminUsername).isPresent()) {
                                log.warn("Username '{}' already exists. Skipping admin creation.", adminUsername);
                                return;
                        }
                        User admin = User.builder()
                                        .email(adminEmail)
                                        .passwordHash(passwordEncoder.encode("admin123"))
                                        .fullName("System Administrator")
                                        .roles(new java.util.HashSet<>(java.util.Set.of(User.Role.ADMIN)))
                                        .authProvider(User.AuthProvider.LOCAL)
                                        .profileComplete(true)
                                        .subscriptionTier(User.SubscriptionTier.PREMIUM)
                                        .username(adminUsername)
                                        .birthDate(LocalDate.of(2000, 1, 1))
                                        .build();
                        userRepository.save(admin);
                        log.info("Admin user created: email={}, password=admin123", adminEmail);
                } catch (Exception e) {
                        log.error("Failed to seed admin user: {}", e.getMessage());
                }
        }

        private void seedTeacherUser() {
                String teacherEmail = "teacher@foreignlang.com";
                String teacherUsername = "teacher";
                try {
                        var existingTeacherOpt = userRepository.findByEmail(teacherEmail);
                        if (existingTeacherOpt.isPresent()) {
                                return;
                        }
                        if (userRepository.findByUsername(teacherUsername).isPresent()) {
                                log.warn("Username '{}' already exists. Skipping teacher creation.", teacherUsername);
                                return;
                        }
                        User teacher = User.builder()
                                        .email(teacherEmail)
                                        .passwordHash(passwordEncoder.encode("teacher123"))
                                        .fullName("Head Teacher")
                                        .roles(new java.util.HashSet<>(java.util.Set.of(User.Role.TEACHER)))
                                        .authProvider(User.AuthProvider.LOCAL)
                                        .profileComplete(true)
                                        .subscriptionTier(User.SubscriptionTier.PREMIUM)
                                        .username(teacherUsername)
                                        .birthDate(LocalDate.of(1995, 5, 20))
                                        .build();
                        userRepository.save(teacher);
                        log.info("Teacher user created: email={}, password=teacher123", teacherEmail);
                } catch (Exception e) {
                        log.error("Failed to seed teacher user: {}", e.getMessage());
                }
        }

        private void seedTopicsAndLessons() {
                if (topicRepository.count() > 0) {
                        log.info("Topics already exist, skipping seed.");
                        return;
                }
                try {
                        // --- Topic 1: Business Email Writing (BEGINNER) ---
                        Topic topic1 = topicRepository.save(Topic.builder()
                                        .title("Business Email Writing")
                                        .description("Master the art of professional email communication. Learn structure, tone, and templates for any business situation.")
                                        .difficultyLevel(Topic.DifficultyLevel.BEGINNER)
                                        .status(ContentStatus.APPROVED)
                                        .approvedAt(LocalDateTime.now())
                                        .build());

                        lessonRepository.saveAll(List.of(
                                        Lesson.builder().topic(topic1).title("Email Structure & Format").orderIndex(1)
                                                        .contentBody("Understanding Email Structure\n\nA professional email has these key parts:\n\n"
                                                                        + "1. Subject Line – Clear and specific (under 60 chars)\n"
                                                                        + "   Good: \"Meeting Reschedule: March 15 → March 17\"\n"
                                                                        + "   Bad: \"Important!!!\"\n\n"
                                                                        + "2. Greeting\n"
                                                                        + "   Formal: \"Dear Mr./Ms. [Last Name],\"\n"
                                                                        + "   Semi-formal: \"Dear [First Name],\"\n"
                                                                        + "   Casual: \"Hi [Name],\"\n\n"
                                                                        + "3. Opening Line\n"
                                                                        + "   \"I am writing to inquire about...\"\n"
                                                                        + "   \"Following up on our meeting yesterday...\"\n\n"
                                                                        + "4. Body – Keep paragraphs short (2-3 sentences).\n\n"
                                                                        + "5. Closing\n"
                                                                        + "   \"Best regards,\" (most versatile)\n"
                                                                        + "   \"Kind regards,\" (slightly warmer)\n"
                                                                        + "   \"Sincerely,\" (most formal)")
                                                        .build(),
                                        Lesson.builder().topic(topic1).title("Formal vs Informal Register")
                                                        .orderIndex(2)
                                                        .contentBody("Choosing the Right Tone\n\n"
                                                                        + "Your tone depends on who you're writing to and your company culture.\n\n"
                                                                        + "FORMAL (executives, clients, first contacts):\n"
                                                                        + "✗ \"Hey, just wanted to check in about the project.\"\n"
                                                                        + "✓ \"I am writing to request an update on the project status.\"\n\n"
                                                                        + "✗ \"Can you send me the report ASAP?\"\n"
                                                                        + "✓ \"Could you please share the report at your earliest convenience?\"\n\n"
                                                                        + "SEMI-FORMAL (colleagues, team members):\n"
                                                                        + "✗ \"Dear Sir/Madam, I wish to express my gratitude...\"\n"
                                                                        + "✓ \"Hi Sarah, Thanks for sending the updated figures.\"\n\n"
                                                                        + "Common Mistakes Vietnamese Speakers Make:\n"
                                                                        + "1. Missing articles: \"Send me report\" → \"Send me the report\"\n"
                                                                        + "2. Overusing \"please\" – one per request is enough\n"
                                                                        + "3. Starting every email with \"I\"\n\n"
                                                                        + "Upgrade Phrases:\n"
                                                                        + "• \"I would appreciate if...\" instead of \"Please...\"\n"
                                                                        + "• \"Would it be possible to...\" instead of \"Can you...\"")
                                                        .build(),
                                        Lesson.builder().topic(topic1).title("Common Email Templates").orderIndex(3)
                                                        .contentBody("Ready-to-Use Email Templates\n\n"
                                                                        + "TEMPLATE 1: Request for Information\n"
                                                                        + "Subject: Inquiry About [Topic]\n\n"
                                                                        + "Dear [Name],\n"
                                                                        + "I am writing to inquire about [specific topic].\n"
                                                                        + "I would appreciate it if you could provide this information by [date].\n"
                                                                        + "Thank you for your time.\n"
                                                                        + "Best regards, [Your Name]\n\n"
                                                                        + "---\n\n"
                                                                        + "TEMPLATE 2: Follow-up After Meeting\n"
                                                                        + "Subject: Follow-up: [Meeting Topic] - [Date]\n\n"
                                                                        + "Hi [Name],\n"
                                                                        + "Thank you for meeting today. Key points discussed:\n"
                                                                        + "• [Point 1]\n"
                                                                        + "• [Point 2]\n"
                                                                        + "• [Action item with deadline]\n"
                                                                        + "Please let me know if I missed anything.\n"
                                                                        + "Best regards, [Your Name]\n\n"
                                                                        + "---\n\n"
                                                                        + "TEMPLATE 3: Apologizing for a Mistake\n"
                                                                        + "Subject: Correction: [What was wrong]\n\n"
                                                                        + "Dear [Name],\n"
                                                                        + "I sincerely apologize for [the error].\n"
                                                                        + "The correct information is: [correction].\n"
                                                                        + "I have taken steps to ensure this does not happen again.\n"
                                                                        + "Thank you for your understanding.\n"
                                                                        + "Kind regards, [Your Name]")
                                                        .build()));

                        // --- Topic 2: Job Interview English (INTERMEDIATE) ---
                        Topic topic2 = topicRepository.save(Topic.builder()
                                        .title("Job Interview English")
                                        .description("Prepare for English job interviews. Practice answering common questions, learn professional vocabulary, and build confidence.")
                                        .difficultyLevel(Topic.DifficultyLevel.INTERMEDIATE)
                                        .status(ContentStatus.APPROVED)
                                        .approvedAt(LocalDateTime.now())
                                        .build());

                        lessonRepository.saveAll(List.of(
                                        Lesson.builder().topic(topic2).title("Tell Me About Yourself").orderIndex(1)
                                                        .contentBody("Mastering \"Tell Me About Yourself\"\n\n"
                                                                        + "Use the Present-Past-Future formula:\n\n"
                                                                        + "PRESENT: What you're currently doing\n"
                                                                        + "\"I'm currently working as a [role] at [company], where I [key responsibility].\"\n\n"
                                                                        + "PAST: Relevant experience\n"
                                                                        + "\"Before this, I spent [X years] at [company] developing my skills in [area].\"\n\n"
                                                                        + "FUTURE: Why you're here\n"
                                                                        + "\"I'm now looking to [career goal], which is why I'm excited about this opportunity.\"\n\n"
                                                                        + "Example Answer:\n"
                                                                        + "\"I'm currently a marketing coordinator at TechViet, where I manage our social media "
                                                                        + "and grew our following by 40%. I studied Digital Marketing at FPT University, "
                                                                        + "completing several real-world projects. I'm excited about this role because it "
                                                                        + "combines analytical skills with creative campaign development.\"\n\n"
                                                                        + "Tips:\n"
                                                                        + "• Keep it under 2 minutes\n"
                                                                        + "• Focus on professional, not personal life\n"
                                                                        + "• Tailor to the job you're applying for\n"
                                                                        + "• Practice until it sounds natural, not memorized")
                                                        .build(),
                                        Lesson.builder().topic(topic2).title("Strengths & Weaknesses").orderIndex(2)
                                                        .contentBody("Talking About Strengths & Weaknesses\n\n"
                                                                        + "STRENGTHS – Use the STAR Method:\n"
                                                                        + "Situation → Task → Action → Result\n\n"
                                                                        + "✗ \"I'm a hard worker.\" (Too vague)\n"
                                                                        + "✓ \"I'm detail-oriented. I identified a billing error that saved the company $5,000.\"\n\n"
                                                                        + "Good Vocabulary:\n"
                                                                        + "• \"I excel at problem-solving under pressure\"\n"
                                                                        + "• \"I'm skilled at cross-team collaboration\"\n"
                                                                        + "• \"I have a strong track record in...\"\n\n"
                                                                        + "WEAKNESSES – Turn them into growth stories:\n"
                                                                        + "✗ \"I'm a perfectionist.\" (Overused)\n"
                                                                        + "✗ \"I don't have any weaknesses.\" (Not credible)\n\n"
                                                                        + "✓ \"Earlier in my career, I found it challenging to delegate tasks. "
                                                                        + "I've since learned to trust my team more, using project management tools "
                                                                        + "to track work without micromanaging.\"\n\n"
                                                                        + "Formula: Past weakness + Steps taken + Current improvement")
                                                        .build(),
                                        Lesson.builder().topic(topic2).title("Asking Smart Questions").orderIndex(3)
                                                        .contentBody("Asking Smart Questions at the Interview\n\n"
                                                                        + "The questions YOU ask reveal your preparation and interest.\n\n"
                                                                        + "GREAT QUESTIONS:\n\n"
                                                                        + "About the Role:\n"
                                                                        + "• \"What does a typical day look like in this position?\"\n"
                                                                        + "• \"What are the most important goals for the first 90 days?\"\n\n"
                                                                        + "About the Team:\n"
                                                                        + "• \"How large is the team I'd be working with?\"\n"
                                                                        + "• \"How would you describe the team culture?\"\n\n"
                                                                        + "About Growth:\n"
                                                                        + "• \"What opportunities for professional development does the company offer?\"\n"
                                                                        + "• \"Where have successful people in this role progressed to?\"\n\n"
                                                                        + "QUESTIONS TO AVOID:\n"
                                                                        + "✗ \"What does your company do?\" (Shows no research)\n"
                                                                        + "✗ \"How much vacation do I get?\" (Too early)\n\n"
                                                                        + "Closing Strong:\n"
                                                                        + "\"Thank you for your time. I'm excited about this opportunity and feel my "
                                                                        + "experience aligns well with what you're looking for.\"\n\n"
                                                                        + "Prepare 3-5 questions before every interview.")
                                                        .build()));

                        // --- Topic 3: Professional Report Writing (ADVANCED) ---
                        Topic topic3 = topicRepository.save(Topic.builder()
                                        .title("Professional Report Writing")
                                        .description("Learn to write clear, structured, and impactful reports. From weekly updates to project proposals and executive summaries.")
                                        .difficultyLevel(Topic.DifficultyLevel.ADVANCED)
                                        .status(ContentStatus.APPROVED)
                                        .approvedAt(LocalDateTime.now())
                                        .build());

                        lessonRepository.saveAll(List.of(
                                        Lesson.builder().topic(topic3).title("Report Structure & Organization")
                                                        .orderIndex(1)
                                                        .contentBody("How to Structure a Professional Report\n\n"
                                                                        + "1. Title Page – Report title, author, date, department\n\n"
                                                                        + "2. Executive Summary – 1 paragraph overview answering:\n"
                                                                        + "   What? Why? Key findings? Recommendations?\n"
                                                                        + "   (Write this LAST)\n\n"
                                                                        + "3. Introduction – Background, purpose, scope, methodology\n\n"
                                                                        + "4. Findings/Body\n"
                                                                        + "   • Present data logically\n"
                                                                        + "   • Use headings and subheadings\n"
                                                                        + "   • Include charts and tables\n\n"
                                                                        + "5. Conclusion – Summarize key findings (no new info)\n\n"
                                                                        + "6. Recommendations – Clear, actionable, prioritized\n\n"
                                                                        + "Key Principles:\n"
                                                                        + "• Be objective and data-driven\n"
                                                                        + "• Use active voice when possible\n"
                                                                        + "• Avoid jargon unless audience-appropriate\n"
                                                                        + "• Every claim needs supporting evidence")
                                                        .build(),
                                        Lesson.builder().topic(topic3).title("Data Presentation & Analysis")
                                                        .orderIndex(2)
                                                        .contentBody("Presenting Data Effectively\n\n"
                                                                        + "Choosing the Right Visual:\n"
                                                                        + "• Trends over time → Line chart\n"
                                                                        + "• Comparisons → Bar chart\n"
                                                                        + "• Proportions → Pie chart\n"
                                                                        + "• Relationships → Scatter plot\n\n"
                                                                        + "Writing About Data:\n"
                                                                        + "✗ \"Sales were 120 units\" (Just stating a number)\n"
                                                                        + "✓ \"Sales increased by 25% to 120 units, exceeding the quarterly target by 15%.\"\n\n"
                                                                        + "Useful Analysis Phrases:\n"
                                                                        + "Increases: \"rose sharply,\" \"grew steadily,\" \"surged by\"\n"
                                                                        + "Decreases: \"declined gradually,\" \"dropped significantly\"\n"
                                                                        + "Stability: \"remained stable,\" \"held steady at\"\n"
                                                                        + "Comparisons: \"outperformed,\" \"lagged behind\"\n\n"
                                                                        + "Hedging Language (when uncertain):\n"
                                                                        + "• \"This suggests that...\"\n"
                                                                        + "• \"The data appears to indicate...\"\n\n"
                                                                        + "Always: Label charts clearly, reference visuals in text, explain significance.")
                                                        .build(),
                                        Lesson.builder().topic(topic3).title("Executive Summary Writing").orderIndex(3)
                                                        .contentBody("Writing a Powerful Executive Summary\n\n"
                                                                        + "The executive summary is often the ONLY part a manager reads.\n\n"
                                                                        + "Include:\n"
                                                                        + "1. Purpose of the report (1 sentence)\n"
                                                                        + "2. Key findings (2-3 sentences)\n"
                                                                        + "3. Main recommendations (1-2 sentences)\n\n"
                                                                        + "BEFORE (Weak):\n"
                                                                        + "\"This report is about customer satisfaction. We did a survey. "
                                                                        + "Some customers are happy and some are not.\"\n\n"
                                                                        + "AFTER (Strong):\n"
                                                                        + "\"This report analyzes Q3 2025 customer satisfaction data from 1,200 surveys. "
                                                                        + "Overall satisfaction declined by 8%, driven by longer support response times. "
                                                                        + "We recommend implementing a chatbot and hiring two support agents to restore "
                                                                        + "satisfaction levels by Q1 2026.\"\n\n"
                                                                        + "Length Guidelines:\n"
                                                                        + "• 1-5 page report → 1 paragraph\n"
                                                                        + "• 5-20 pages → Half page\n"
                                                                        + "• 20+ pages → 1 full page\n\n"
                                                                        + "Pro Tips:\n"
                                                                        + "• Write it AFTER completing the full report\n"
                                                                        + "• Use specific numbers, not vague statements\n"
                                                                        + "• Make recommendations actionable and time-bound")
                                                        .build()));

                        log.info("Seeded 3 topics with 9 lessons");
                } catch (Exception e) {
                        log.error("Failed to seed topics and lessons: {}", e.getMessage());
                }
        }
}
