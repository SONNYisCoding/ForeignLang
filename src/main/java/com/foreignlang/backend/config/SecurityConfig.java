package com.foreignlang.backend.config;

import com.foreignlang.backend.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final CustomOAuth2UserService customOAuth2UserService;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .authorizeHttpRequests(auth -> auth
                                                // Public endpoints
                                                .requestMatchers("/", "/login", "/oauth2/**").permitAll()
                                                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                                                .requestMatchers("/api/v1/public/**").permitAll()
                                                // Protected endpoints
                                                .requestMatchers("/dashboard/**").authenticated()
                                                .requestMatchers("/lessons/**").authenticated()
                                                .requestMatchers("/api/v1/**").authenticated()
                                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                                .anyRequest().authenticated())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .oauth2Login(oauth2 -> oauth2
                                                .loginPage("/login")
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService))
                                                // Redirect to Frontend Dashboard after login
                                                .defaultSuccessUrl("http://localhost:5173/dashboard", true)
                                                .failureUrl("http://localhost:5173/?error=true"))
                                .logout(logout -> logout
                                                .logoutSuccessUrl("http://localhost:5173/")
                                                .invalidateHttpSession(true)
                                                .deleteCookies("JSESSIONID"))
                                .csrf(csrf -> csrf.disable());

                return http.build();
        }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
                configuration.setAllowedOrigins(java.util.List.of("http://localhost:5173"));
                configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(java.util.List.of("*"));
                configuration.setAllowCredentials(true);
                org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
