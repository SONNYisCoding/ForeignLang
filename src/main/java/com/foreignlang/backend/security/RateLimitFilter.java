package com.foreignlang.backend.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Only apply rate limiting to AI endpoints (can be adjusted as needed)
        if (path.startsWith("/api/v1/email/generate") || path.startsWith("/api/v1/chat/")) {
            String key = resolveRateLimitKey(request);
            Bucket bucket = cache.computeIfAbsent(key, k -> createNewBucket());

            log.debug("Rate limit path: {}, key: {}, available tokens: {}", path, key, bucket.getAvailableTokens());

            if (!bucket.tryConsume(1)) {
                log.warn("Rate limit exceeded for key: {}", key);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Too many requests. Please try again later.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveRateLimitKey(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // 1. Authenticated User handling
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            if (auth.getPrincipal() instanceof UserPrincipal) {
                return "user:" + ((UserPrincipal) auth.getPrincipal()).getUser().getId();
            }
            // Fallback for OAuth2User or other forms of authenticated principal
            return "user:" + auth.getName();
        }

        // 2. Unauthenticated User handling - Fallback to IP address
        return "ip:" + extractClientIp(request);
    }

    private String extractClientIp(HttpServletRequest request) {
        String header = request.getHeader("X-Forwarded-For");
        if (header != null && !header.isEmpty()) {
            return header.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private Bucket createNewBucket() {
        // Limit: 5 requests per 1 minute for AI endpoints
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }
}
