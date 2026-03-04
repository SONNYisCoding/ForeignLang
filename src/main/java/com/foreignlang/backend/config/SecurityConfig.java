package com.foreignlang.backend.config;

import com.foreignlang.backend.service.CustomOAuth2UserService;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.foreignlang.backend.security.RateLimitFilter;

import java.util.List;
import com.foreignlang.backend.security.JwtAuthenticationFilter;
import com.foreignlang.backend.security.JwtTokenProvider;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

        private final CustomOAuth2UserService customOAuth2UserService;
        private final com.foreignlang.backend.service.CustomOidcUserService customOidcUserService;
        private final UserRepository userRepository;
        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final com.foreignlang.backend.security.JwtTokenProvider jwtTokenProvider;

        public SecurityConfig(
                        CustomOAuth2UserService customOAuth2UserService,
                        com.foreignlang.backend.service.CustomOidcUserService customOidcUserService,
                        UserRepository userRepository,
                        JwtAuthenticationFilter jwtAuthenticationFilter,
                        com.foreignlang.backend.security.JwtTokenProvider jwtTokenProvider) {
                this.customOAuth2UserService = customOAuth2UserService;
                this.customOidcUserService = customOidcUserService;
                this.userRepository = userRepository;
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.jwtTokenProvider = jwtTokenProvider;
        }

        @org.springframework.beans.factory.annotation.Value("${app.frontend.urls}")
        private List<String> frontendUrls;

        private String getFrontendUrl(jakarta.servlet.http.HttpServletRequest request) {
                String referer = request.getHeader("Referer");
                String origin = request.getHeader("Origin");
                String sourceUrl = origin != null ? origin : (referer != null ? referer : "");

                for (String url : frontendUrls) {
                        if (sourceUrl.startsWith(url)) {
                                return url;
                        }
                }

                jakarta.servlet.http.HttpSession session = request.getSession(false);
                if (session != null) {
                        String savedUrl = (String) session.getAttribute("saved_frontend_url");
                        if (savedUrl != null && frontendUrls.contains(savedUrl)) {
                                return savedUrl;
                        }
                }

                return frontendUrls.isEmpty() ? "" : frontendUrls.get(0);
        }

        @Bean
        public AuthenticationSuccessHandler oAuth2SuccessHandler() {
                return (request, response, authentication) -> {
                        Object principal = authentication.getPrincipal();
                        log.info("Authentication Class: {}", authentication.getClass().getName());
                        log.info("Principal Class: {}", principal != null ? principal.getClass().getName() : "NULL");

                        User user = null;

                        if (principal instanceof com.foreignlang.backend.security.UserPrincipal) {
                                user = ((com.foreignlang.backend.security.UserPrincipal) principal).getUser();
                        } else if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User) {
                                // Fallback if for some reason we got DefaultOAuth2User
                                log.warn("Principal is NOT UserPrincipal. It is: {}", principal.getClass().getName());
                                var oauth2User = (org.springframework.security.oauth2.core.user.OAuth2User) principal;

                                // Try getting ID directly from attributes first (most reliable if passed)
                                String userIdStr = (String) oauth2User.getAttribute("userId");
                                if (userIdStr != null) {
                                        log.info("Found userId in attributes: {}", userIdStr);
                                        user = userRepository.findById(java.util.UUID.fromString(userIdStr))
                                                        .orElse(null);
                                }

                                if (user == null) {
                                        String email = oauth2User.getAttribute("email");
                                        if (email != null) {
                                                log.info("Attempting fallback lookup by email: {}", email);
                                                user = userRepository.findByEmail(email.toLowerCase()).orElse(null);
                                        }
                                }
                        }

                        if (user != null) {
                                log.info("OAuth2 Success: Direct User Object Access. ID={}, Email={}, ProfileComplete={}",
                                                user.getId(), user.getEmail(), user.isProfileComplete());

                                // Unified redirection to frontend callback handler
                                String targetUrl = getFrontendUrl(request);
                                String token = jwtTokenProvider.generateTokenFromEmail(user.getEmail());
                                log.info("OAuth2 Success: Redirecting to frontend auth handler at {}", targetUrl);
                                response.sendRedirect(targetUrl + "/oauth2/redirect?token=" + token);
                        } else {
                                String targetUrl = getFrontendUrl(request);
                                log.error("CRITICAL: Failed to retrieve User object in SuccessHandler");
                                response.sendRedirect(targetUrl + "/login?error=auth_principal_failure");
                        }
                };

        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf
                                                .csrfTokenRepository(
                                                                org.springframework.security.web.csrf.CookieCsrfTokenRepository
                                                                                .withHttpOnlyFalse())
                                                .ignoringRequestMatchers("/api/v1/auth/login", "/api/v1/auth/register",
                                                                "/api/v1/auth/logout", "/api/v1/chat/**",
                                                                "/api/v1/assessment/**", "/api/v1/email/**",
                                                                "/api/v1/quota/**")) // Optional:
                                // Ignore
                                // auth
                                // endpoints if issues arise,
                                // but better to support XSRF
                                .headers(headers -> headers
                                                .frameOptions(frame -> frame.deny()) // Prevent Clickjacking
                                                .xssProtection(xss -> xss.disable()) // Modern browsers ignore this, CSP
                                                                                     // is better
                                                .contentSecurityPolicy(csp -> csp.policyDirectives(
                                                                "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';")))
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
                                                .requestMatchers("/api/v1/vocabulary/**").permitAll()
                                                .requestMatchers("/api/v1/email/**").permitAll() // Allow manual session
                                                                                                 // check in controller
                                                .requestMatchers("/api/v1/quota/**").permitAll() // Allow manual session
                                                                                                 // check
                                                .requestMatchers("/api/v1/notifications/**").permitAll() // Allow manual
                                                                                                         // session
                                                                                                         // check
                                                .requestMatchers("/api/v1/teachers/**").permitAll() // Public Teacher
                                                                                                    // Profiles
                                                .requestMatchers("/api/v1/payment/**").permitAll() // SePay Webhook
                                                .requestMatchers("/api/v1/chat/**").permitAll() // Chatbot (guest +
                                                                                                // user)

                                                // Static resources
                                                .requestMatchers("/css/**", "/js/**", "/images/**", "/favicon.ico")
                                                .permitAll()

                                                // OAuth2 and login pages
                                                .requestMatchers("/", "/login", "/oauth2/**", "/login/oauth2/code/**",
                                                                "/error")
                                                .permitAll()

                                                // Admin routes
                                                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                                                // Secure Swagger UI & Actuator strictly to ADMIN
                                                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/actuator/**")
                                                .hasRole("ADMIN")

                                                // All other API and pages require authentication
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                                .addFilterAfter(new RateLimitFilter(), UsernamePasswordAuthenticationFilter.class)
                                .addFilterBefore(new jakarta.servlet.Filter() {
                                        @Override
                                        public void doFilter(jakarta.servlet.ServletRequest request,
                                                        jakarta.servlet.ServletResponse response,
                                                        jakarta.servlet.FilterChain chain)
                                                        throws java.io.IOException, jakarta.servlet.ServletException {
                                                jakarta.servlet.http.HttpServletRequest req = (jakarta.servlet.http.HttpServletRequest) request;
                                                if (req.getRequestURI().startsWith("/oauth2/authorization/")) {
                                                        String referer = req.getHeader("Referer");
                                                        if (referer != null) {
                                                                for (String url : frontendUrls) {
                                                                        if (referer.startsWith(url)) {
                                                                                req.getSession().setAttribute(
                                                                                                "saved_frontend_url",
                                                                                                url);
                                                                                break;
                                                                        }
                                                                }
                                                        }
                                                }
                                                chain.doFilter(request, response);
                                        }
                                }, org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter.class)
                                .oauth2Login(oauth2 -> oauth2
                                                .loginPage("/login")
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService)
                                                                .oidcUserService(customOidcUserService))
                                                .successHandler(oAuth2SuccessHandler())
                                                .failureHandler((request, response, exception) -> {
                                                        response.sendRedirect(getFrontendUrl(
                                                                        (jakarta.servlet.http.HttpServletRequest) request)
                                                                        + "/?error=true");
                                                }))
                                .logout(logout -> logout
                                                .logoutSuccessHandler((request, response, authentication) -> {
                                                        response.sendRedirect(getFrontendUrl(
                                                                        (jakarta.servlet.http.HttpServletRequest) request)
                                                                        + "/");
                                                })
                                                .invalidateHttpSession(true)
                                                .deleteCookies("JSESSIONID", "XSRF-TOKEN"))
                                // For API endpoints, strictly return 401 instead of redirecting anywhere
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        response.setStatus(401);
                                                        response.setContentType("application/json;charset=UTF-8");
                                                        response.getWriter().write(
                                                                        "{\"code\":\"UNAUTHORIZED\", \"message\":\""
                                                                                        + authException.getMessage()
                                                                                        + "\"}");
                                                }));

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(frontendUrls); // Add multiple domains here
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-XSRF-TOKEN"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
