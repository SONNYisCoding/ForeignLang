package com.foreignlang.backend.dto;

import java.time.LocalDate;

public record ProfileUpdateRequest(
        String fullName,
        String username,
        String avatarUrl,
        LocalDate birthDate,
        String bio,
        String specialization,
        String learningGoal,
        com.foreignlang.backend.entity.ProficiencyLevel proficiencyLevel) {
}
