package com.foreignlang.backend.security;

import com.foreignlang.backend.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class UserPrincipal implements UserDetails, org.springframework.security.oauth2.core.oidc.user.OidcUser {

    private final User user;
    private java.util.Map<String, Object> attributes;
    private org.springframework.security.oauth2.core.oidc.OidcIdToken idToken;
    private org.springframework.security.oauth2.core.oidc.OidcUserInfo userInfo;

    public UserPrincipal(User user) {
        this.user = user;
    }

    public UserPrincipal(User user, java.util.Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    public UserPrincipal(User user, java.util.Map<String, Object> attributes,
            org.springframework.security.oauth2.core.oidc.OidcIdToken idToken,
            org.springframework.security.oauth2.core.oidc.OidcUserInfo userInfo) {
        this.user = user;
        this.attributes = attributes;
        this.idToken = idToken;
        this.userInfo = userInfo;
    }

    public User getUser() {
        return user;
    }

    @Override
    public java.util.Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public java.util.Map<String, Object> getClaims() {
        return idToken != null ? idToken.getClaims() : java.util.Collections.emptyMap();
    }

    @Override
    public org.springframework.security.oauth2.core.oidc.OidcUserInfo getUserInfo() {
        return userInfo;
    }

    @Override
    public org.springframework.security.oauth2.core.oidc.OidcIdToken getIdToken() {
        return idToken;
    }

    @Override
    public String getName() {
        return user.getEmail();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Spring Security expects roles to start with "ROLE_" usually,
        // but hasRole check adds it automatically.
        // If we use hasAuthority, we need exact string.
        // Let's stick to "ROLE_" convention for safety with newer Spring Security.
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // We use email for authentication
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
