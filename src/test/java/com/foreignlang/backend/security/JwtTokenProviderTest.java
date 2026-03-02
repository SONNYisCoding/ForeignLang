package com.foreignlang.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret",
                "dGhpcy1pcy1hLXZlcnktc2VjdXJlLWFuZC1sb25nLXNlY3JldC1rZXktdGhhdC1tdXN0LWJlLWF0LWxlYXN0LTMyeWJ0ZXM=");
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationMs", 3600000); // 1 hour
    }

    @Test
    void generateToken_ShouldReturnValidJwt() {
        // Arrange
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("test@example.com");

        // Act
        String token = jwtTokenProvider.generateToken(auth);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("test@example.com", jwtTokenProvider.getUsernameFromJWT(token));
    }

    @Test
    void generateTokenFromEmail_ShouldReturnValidJwt() {
        String token = jwtTokenProvider.generateTokenFromEmail("direct@example.com");
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("direct@example.com", jwtTokenProvider.getUsernameFromJWT(token));
    }

    @Test
    void validateToken_ShouldReturnFalseForExpiredToken() throws InterruptedException {
        // Arrange: 1 millisecond expiration
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationMs", 1);
        String token = jwtTokenProvider.generateTokenFromEmail("expired@example.com");

        // Wait to actually expire
        Thread.sleep(10);

        // Act
        boolean isValid = jwtTokenProvider.validateToken(token);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void validateToken_ShouldReturnFalseForTamperedToken() {
        String token = jwtTokenProvider.generateTokenFromEmail("tampered@example.com");
        // Tamper with the token by appending an invalid string
        String tamperedToken = token + "invalid";

        assertFalse(jwtTokenProvider.validateToken(tamperedToken));
    }

    @Test
    void validateToken_ShouldReturnFalseForEmptyToken() {
        assertFalse(jwtTokenProvider.validateToken(""));
        assertFalse(jwtTokenProvider.validateToken(null));
    }
}
