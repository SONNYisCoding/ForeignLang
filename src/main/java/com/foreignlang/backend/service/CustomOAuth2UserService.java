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
import org.springframework.context.annotation.Primary;

/**
 * Custom OAuth2 User Service that handles Google OAuth2 login.
 * Auto-registers new users and creates their usage quota on first login.
 * New users go to Profile Setup page (profileComplete = false).
 */
@Service
@Primary // FORCE Spring to use this bean
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final UsageQuotaRepository usageQuotaRepository;

    @jakarta.annotation.PostConstruct
    public void init() {
        log.info("CustomOAuth2UserService BEAN CREATED AND REGISTERED");
    }

    @Override
    // @Transactional - Removed to ensure immediate commit for SuccessHandler
    // visibility
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            String email = oAuth2User.getAttribute("email");
            if (email != null)
                email = email.toLowerCase(); // Normalize email

            String name = oAuth2User.getAttribute("name");
            String picture = oAuth2User.getAttribute("picture");
            String googleId = oAuth2User.getAttribute("sub"); // Google's unique user ID

            log.info("OAuth2 Login attempt for email: {}", email);

            // Find by Google ID first (for linked accounts), then by email
            String finalEmail = email; // For lambda
            User user = userRepository.findByGoogleId(googleId)
                    .or(() -> userRepository.findByEmail(finalEmail))
                    .orElseGet(() -> createNewGoogleUser(finalEmail, name, picture, googleId));

            // If existing user without Google ID, link it now
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                if (user.getAuthProvider() == User.AuthProvider.LOCAL) {
                    user.setAuthProvider(User.AuthProvider.BOTH);
                }
            }

            // Update profile info on each login (in case Google profile changed)
            user.setFullName(name);
            user.setAvatarUrl(picture);

            log.info("Saving user to DB...");
            User savedUser = userRepository.saveAndFlush(user);
            log.info("User saved with ID: {}", savedUser.getId());

            log.info("User {} logged in with roles: {}, profileComplete: {}",
                    email, user.getRoles(), user.isProfileComplete());

            java.util.Map<String, Object> attributes = new java.util.HashMap<>(oAuth2User.getAttributes());
            attributes.put("userId", user.getId().toString());
            attributes.put("profileComplete", user.isProfileComplete());

            return new com.foreignlang.backend.security.UserPrincipal(user, attributes);
        } catch (Exception e) {
            log.error("CRITICAL ERROR in CustomOAuth2UserService: {}", e.toString());
            e.printStackTrace();
            throw new OAuth2AuthenticationException("Internal Server Error: " + e.getMessage());
        }
    }

    private User createNewGoogleUser(String email, String name, String picture, String googleId) {
        log.info("Creating new Google user for email: {}", email);

        User newUser = User.builder()
                .email(email)
                .fullName(name)
                .avatarUrl(picture)
                .googleId(googleId)
                .authProvider(User.AuthProvider.GOOGLE)
                .profileComplete(false) // Needs to complete profile
                .roles(new java.util.HashSet<>(java.util.Set.of(User.Role.GUEST))) // GUEST until profile complete
                .subscriptionTier(User.SubscriptionTier.FREE)
                .build();

        log.info("Saving new Google user...");
        User savedUser = userRepository.saveAndFlush(newUser);
        log.info("New Google user saved with ID: {}", savedUser.getId());

        // Create usage quota with 5 bonus uses
        UsageQuota quota = UsageQuota.createForNewUser(savedUser);
        usageQuotaRepository.saveAndFlush(quota);
        log.info("Usage quota created and saved.");

        log.info("Created new Google user and quota for: {}", email);

        return savedUser;
    }
}
