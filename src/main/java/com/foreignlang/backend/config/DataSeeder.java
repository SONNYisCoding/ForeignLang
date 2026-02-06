package com.foreignlang.backend.config;

import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Bean
        public CommandLineRunner initData() {
                return args -> {
                        seedAdminUser();
                        seedTeacherUser();
                };
        }

        private void seedAdminUser() {
                String adminEmail = "admin@foreignlang.com";
                String adminUsername = "admin";

                try {
                        if (userRepository.findByEmail(adminEmail).isPresent()) {
                                User admin = userRepository.findByEmail(adminEmail).get();
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
                        if (userRepository.findByEmail(teacherEmail).isPresent()) {
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
}
