package com.foreignlang.backend.service;

import com.foreignlang.backend.entity.UsageQuota;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.UsageQuotaRepository;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.annotation.Primary;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Service
@Primary // FORCE Spring to use this bean
@RequiredArgsConstructor
@Slf4j
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;
    private final UsageQuotaRepository usageQuotaRepository;

    @jakarta.annotation.PostConstruct
    public void init() {
        log.info("CustomOidcUserService BEAN CREATED AND REGISTERED");
    }

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        try {
            return processUser(oidcUser);
        } catch (Exception e) {
            log.error("CRITICAL ERROR in CustomOidcUserService: {}", e.toString());
            e.printStackTrace();
            throw new OAuth2AuthenticationException("Internal Server Error: " + e.getMessage());
        }
    }

    private OidcUser processUser(OidcUser oidcUser) {
        String email = oidcUser.getEmail(); // OidcUser has direct getEmail()
        if (email != null)
            email = email.toLowerCase();

        String name = oidcUser.getFullName();
        String picture = oidcUser.getPicture();
        String googleId = oidcUser.getSubject();

        log.info("OIDC Login attempt for email: {}", email);

        String finalEmail = email;
        User user = userRepository.findByGoogleId(googleId)
                .or(() -> userRepository.findByEmail(finalEmail))
                .orElseGet(() -> createNewGoogleUser(finalEmail, name, picture, googleId));

        if (user.getGoogleId() == null) {
            user.setGoogleId(googleId);
            user.setAuthProvider(User.AuthProvider.GOOGLE);
        }

        user.setFullName(name);
        user.setAvatarUrl(picture);

        log.info("Saving OIDC user to DB...");
        User savedUser = userRepository.saveAndFlush(user);

        log.info("User {} logged in with OIDC. Roles: {}", email, savedUser.getRoles());

        java.util.Map<String, Object> attributes = new java.util.HashMap<>(oidcUser.getAttributes());
        attributes.put("userId", savedUser.getId().toString());
        attributes.put("profileComplete", savedUser.isProfileComplete());

        return new UserPrincipal(savedUser, attributes, oidcUser.getIdToken(), oidcUser.getUserInfo());
    }

    private User createNewGoogleUser(String email, String name, String picture, String googleId) {
        log.info("Creating new Google user (OIDC) for email: {}", email);

        User newUser = User.builder()
                .email(email)
                .fullName(name)
                .avatarUrl(picture)
                .googleId(googleId)
                .authProvider(User.AuthProvider.GOOGLE)
                .profileComplete(false)
                .roles(new java.util.HashSet<>(java.util.Set.of(User.Role.GUEST)))
                .subscriptionTier(User.SubscriptionTier.FREE)
                .build();

        User savedUser = userRepository.saveAndFlush(newUser);

        UsageQuota quota = UsageQuota.createForNewUser(savedUser);
        usageQuotaRepository.saveAndFlush(quota);

        log.info("Created new Google user and quota for: {}", email);
        return savedUser;
    }
}
