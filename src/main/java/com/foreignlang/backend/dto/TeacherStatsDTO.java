package com.foreignlang.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeacherStatsDTO {
    private long totalLearningHours;
    private long activeStudents;
    private double completionRate;
    private double avgScore;
}
