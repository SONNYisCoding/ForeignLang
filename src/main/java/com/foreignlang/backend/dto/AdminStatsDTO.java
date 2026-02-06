package com.foreignlang.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsDTO {
    private long totalUsers;
    private long totalLearners;
    private long totalTeachers;
    private long totalLessons;
    private long pendingApprovals;
    private long activeToday; // Placeholder for now, or count logins
}
