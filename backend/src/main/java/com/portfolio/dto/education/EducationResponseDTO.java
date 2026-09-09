package com.portfolio.dto.education;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record EducationResponseDTO(
        Long id,
        String institution,
        String degree,
        String fieldOfStudy,
        LocalDate startDate,
        LocalDate endDate,
        String description,
        int displayOrder,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
