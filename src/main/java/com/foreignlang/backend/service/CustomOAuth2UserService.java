package com.foreignlang.backend.service;

import com.foreignlang.backend.entity.UsageQuota;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UsageQuotaRepository;
import com.foreignlang.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Custom OAuth2 User Service that handles Google OAuth2 login.
 * Auto-registers new users and creates their usage quota on first login.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final UsageQuotaRepository usageQuotaRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        log.info("OAuth2 Login attempt for email: {}", email);

        // Find or create user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewUser(email, name, picture));

        // Update profile info on each login (in case Google profile changed)
        user.setFullName(name);
        user.setAvatarUrl(picture);
        userRepository.save(user);

        log.info("User {} logged in with role: {}", email, user.getRole());

        return oAuth2User;
    }

    private User createNewUser(String email, String name, String picture) {
        log.info("Creating new user for email: {}", email);

        User newUser = User.builder()
                .email(email)
                .fullName(name)
                .avatarUrl(picture)
                .role(User.Role.LEARNER) // New users get LEARNER role
                .subscriptionTier(User.SubscriptionTier.FREE)
                .build();

        User savedUser = userRepository.save(newUser);

        // Create usage quota for the new user
        UsageQuota quota = UsageQuota.builder()
                .user(savedUser)
                .dailyRequestsCount(0)
                .lastResetDate(LocalDate.now())
                .build();

        usageQuotaRepository.save(quota);

        log.info("Created new user and quota for: {}", email);

        return savedUser;
    }
}
