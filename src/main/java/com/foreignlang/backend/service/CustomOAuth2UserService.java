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
import org.springframework.context.annotation.Primary;
import java.util.Map;

/**
 * Custom OAuth2 User Service that handles both Google and Facebook OAuth2
 * logins.
 * Auto-registers new users and links accounts based on email.
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
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // "google" or "facebook"

        try {
            Map<String, Object> attributes = oAuth2User.getAttributes();
            String email = (String) attributes.get("email");
            if (email != null)
                email = email.toLowerCase();

            String name = (String) attributes.get("name");
            String picture = null;
            String providerId = null;

            if ("google".equalsIgnoreCase(registrationId)) {
                providerId = (String) attributes.get("sub");
                picture = (String) attributes.get("picture");
            } else if ("facebook".equalsIgnoreCase(registrationId)) {
                providerId = (String) attributes.get("id");

                // Facebook returns picture as a nested object
                if (attributes.containsKey("picture")) {
                    Object picObj = attributes.get("picture");
                    if (picObj instanceof Map<?, ?> pictureObj) {
                        if (pictureObj.containsKey("data")) {
                            Object dataObj = pictureObj.get("data");
                            if (dataObj instanceof Map<?, ?> dataMap) {
                                picture = (String) dataMap.get("url");
                            }
                        }
                    }
                }
            }

            log.info("OAuth2 Login attempt - Provider: {}, Email: {}, ProviderId: {}", registrationId, email,
                    providerId);

            User user = null;

            // 1. Try finding by Google ID or Facebook ID directly
            if ("google".equalsIgnoreCase(registrationId)) {
                user = userRepository.findByGoogleId(providerId).orElse(null);
            } else if ("facebook".equalsIgnoreCase(registrationId)) {
                user = userRepository.findByFacebookId(providerId).orElse(null);
            }

            // 2. If not found by provider ID, try finding by email to link accounts
            if (user == null && email != null) {
                user = userRepository.findByEmail(email).orElse(null);
            }

            // 3. If STILL not found, create a new user
            if (user == null) {
                user = createNewOAuthUser(email, name, picture, providerId, registrationId);
            } else {
                // UPDATE or LINK existing user
                boolean updated = false;

                if ("google".equalsIgnoreCase(registrationId) && user.getGoogleId() == null) {
                    user.setGoogleId(providerId);
                    updated = true;
                } else if ("facebook".equalsIgnoreCase(registrationId) && user.getFacebookId() == null) {
                    user.setFacebookId(providerId);
                    updated = true;
                }

                // Update AuthProvider enum to MULTIPLE or BOTH if linking
                if (updated) {
                    if (user.getGoogleId() != null && user.getFacebookId() != null && user.getPasswordHash() != null) {
                        user.setAuthProvider(User.AuthProvider.MULTIPLE);
                    } else if ((user.getGoogleId() != null && user.getFacebookId() != null) ||
                            (user.getGoogleId() != null && user.getPasswordHash() != null) ||
                            (user.getFacebookId() != null && user.getPasswordHash() != null)) {
                        user.setAuthProvider(User.AuthProvider.BOTH);
                    }
                }

                // Always update basic info from OAuth provider just in case (optional, but good
                // UX)
                if (user.getFullName() == null)
                    user.setFullName(name);
                if (user.getAvatarUrl() == null)
                    user.setAvatarUrl(picture);

                user = userRepository.saveAndFlush(user);
            }

            log.info("User {} logged in. ProfileComplete: {}", email, user.isProfileComplete());

            java.util.Map<String, Object> finalAttributes = new java.util.HashMap<>(attributes);
            finalAttributes.put("userId", user.getId().toString());
            finalAttributes.put("profileComplete", user.isProfileComplete());

            return new com.foreignlang.backend.security.UserPrincipal(user, finalAttributes);

        } catch (Exception e) {
            log.error("CRITICAL ERROR in CustomOAuth2UserService", e);
            throw new OAuth2AuthenticationException("Internal Server Error: " + e.getMessage());
        }
    }

    private User createNewOAuthUser(String email, String name, String picture, String providerId,
            String registrationId) {
        log.info("Creating new {} user for email: {}", registrationId, email);

        User.AuthProvider authProvider = "facebook".equalsIgnoreCase(registrationId)
                ? User.AuthProvider.FACEBOOK
                : User.AuthProvider.GOOGLE;

        User.UserBuilder userBuilder = User.builder()
                .email(email)
                .fullName(name)
                .avatarUrl(picture)
                .authProvider(authProvider)
                .profileComplete(false) // Needs to complete profile
                .roles(new java.util.HashSet<>(java.util.Set.of(User.Role.GUEST))) // GUEST until profile complete
                .subscriptionTier(User.SubscriptionTier.FREE);

        if ("google".equalsIgnoreCase(registrationId)) {
            userBuilder.googleId(providerId);
        } else if ("facebook".equalsIgnoreCase(registrationId)) {
            userBuilder.facebookId(providerId);
        }

        User savedUser = userRepository.saveAndFlush(userBuilder.build());
        log.info("New {} user saved with ID: {}", registrationId, savedUser.getId());

        // Create usage quota with 5 bonus uses
        UsageQuota quota = UsageQuota.createForNewUser(savedUser);
        usageQuotaRepository.saveAndFlush(quota);

        return savedUser;
    }
}
