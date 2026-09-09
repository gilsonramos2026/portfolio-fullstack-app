package com.portfolio.dto.skill;

import java.time.LocalDateTime;

public record SkillResponseDTO(
        Long id,
        String name,
        String category,
        int proficiency,
        int displayOrder,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
