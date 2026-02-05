package com.foreignlang.backend.dto;

import java.time.LocalDate;

public record ProfileUpdateRequest(
        String fullName,
        String username,
        String avatarUrl,
        LocalDate birthDate) {
}
