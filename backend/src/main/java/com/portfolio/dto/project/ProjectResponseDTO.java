package com.portfolio.dto.project;

import com.portfolio.backend.domain.ProjectStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Representação pública de um projeto, retornada nos endpoints de leitura.
 */
public record ProjectResponseDTO(
        Long id,
        String title,
        String shortDescription,
        String description,
        String repositoryUrl,
        String demoUrl,
        String imageUrl,
        ProjectStatus status,
        boolean featured,
        int displayOrder,
        LocalDate startDate,
        LocalDate endDate,
        List<String> techStack,
        List<ProjectImageResponseDTO> images,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
