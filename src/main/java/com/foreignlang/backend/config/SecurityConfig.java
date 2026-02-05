package com.foreignlang.backend.config;

import com.foreignlang.backend.service.CustomOAuth2UserService;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Optional;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

        private final CustomOAuth2UserService customOAuth2UserService;
        private final UserRepository userRepository;

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder(12);
        }

        @Bean
        public AuthenticationSuccessHandler oAuth2SuccessHandler() {
                return (request, response, authentication) -> {
                        if (authentication instanceof OAuth2AuthenticationToken token) {
                                String email = token.getPrincipal().getAttribute("email");
                                log.info("OAuth2 success handler for email: {}", email);

                                Optional<User> userOpt = userRepository.findByEmail(email);
                                if (userOpt.isPresent()) {
                                        User user = userOpt.get();
                                        log.info("User found: profileComplete={}, role={}", user.isProfileComplete(),
                                                        user.getRole());

                                        if (!user.isProfileComplete()) {
                                                log.info("Redirecting to profile-setup");
                                                response.sendRedirect("http://localhost:5173/profile-setup");
                                                return;
                                        }
                                }
                        }
                        log.info("Redirecting to dashboard");
                        response.sendRedirect("http://localhost:5173/dashboard");
                };
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                // Auth API - completely open
                                                .requestMatchers("/api/v1/auth/**").permitAll()
                                                .requestMatchers("/api/v1/auth/register").permitAll()
                                                .requestMatchers("/api/v1/auth/login").permitAll()
                                                .requestMatchers("/api/v1/user/**").permitAll() // Allow manual session
                                                                                                // check

                                                // Public APIs
                                                .requestMatchers("/api/v1/public/**").permitAll()
                                                .requestMatchers("/api/v1/topics/**").permitAll()
                                                .requestMatchers("/api/v1/templates/**").permitAll()
                                                .requestMatchers("/api/v1/email/**").permitAll() // Allow manual session
                                                                                                 // check in controller

                                                // Static resources
                                                .requestMatchers("/css/**", "/js/**", "/images/**", "/favicon.ico")
                                                .permitAll()

                                                // OAuth2 and login pages
                                                .requestMatchers("/", "/login", "/oauth2/**", "/error").permitAll()

                                                // Admin routes
                                                .requestMatchers("/admin/**").hasRole("ADMIN")

                                                // All other API and pages require authentication
                                                .anyRequest().authenticated())
                                .oauth2Login(oauth2 -> oauth2
                                                .loginPage("/login")
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService))
                                                .successHandler(oAuth2SuccessHandler())
                                                .failureUrl("http://localhost:5173/?error=true"))
                                .logout(logout -> logout
                                                .logoutSuccessUrl("http://localhost:5173/")
                                                .invalidateHttpSession(true)
                                                .deleteCookies("JSESSIONID"))
                                // For API endpoints, return 401 instead of redirect
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        String path = request.getRequestURI();
                                                        if (path.startsWith("/api/")) {
                                                                response.setStatus(401);
                                                                response.setContentType("application/json");
                                                                response.getWriter()
                                                                                .write("{\"error\":\"Unauthorized\"}");
                                                        } else {
                                                                response.sendRedirect("http://localhost:5173/");
                                                        }
                                                }));

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("http://localhost:5173"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
