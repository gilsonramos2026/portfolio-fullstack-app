package com.portfolio.mapper;

import com.portfolio.domain.Project;
import com.portfolio.dto.project.ProjectImageResponseDTO;
import com.portfolio.dto.project.ProjectRequestDTO;
import com.portfolio.dto.project.ProjectResponseDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class ProjectMapper {

    public Project toEntity(ProjectRequestDTO dto) {
        return Project.builder()
                .title(dto.title())
                .shortDescription(dto.shortDescription())
                .description(dto.description())
                .repositoryUrl(dto.repositoryUrl())
                .demoUrl(dto.demoUrl())
                .imageUrl(dto.imageUrl())
                .status(dto.status())
                .featured(dto.featured())
                .displayOrder(dto.displayOrder())
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .techStack(new ArrayList<>(dto.techStack()))
                .build();
    }

    public void updateEntityFromDto(ProjectRequestDTO dto, Project project) {
        project.setTitle(dto.title());
        project.setShortDescription(dto.shortDescription());
        project.setDescription(dto.description());
        project.setRepositoryUrl(dto.repositoryUrl());
        project.setDemoUrl(dto.demoUrl());
        project.setImageUrl(dto.imageUrl());
        project.setStatus(dto.status());
        project.setFeatured(dto.featured());
        project.setDisplayOrder(dto.displayOrder());
        project.setStartDate(dto.startDate());
        project.setEndDate(dto.endDate());

        project.getTechStack().clear();
        project.getTechStack().addAll(dto.techStack());
    }

    public ProjectResponseDTO toResponseDTO(Project project) {
        return new ProjectResponseDTO(
                project.getId(),
                project.getTitle(),
                project.getShortDescription(),
                project.getDescription(),
                project.getRepositoryUrl(),
                project.getDemoUrl(),
                project.getImageUrl(),
                project.getStatus(),
                project.isFeatured(),
                project.getDisplayOrder(),
                project.getStartDate(),
                project.getEndDate(),
                project.getTechStack(),
                project.getImages().stream()
                        .map(img -> new ProjectImageResponseDTO(img.getId(), img.getUrl(), img.getDisplayOrder()))
                        .toList(),
                project.getCreatedAt(),
                project.getUpdatedAt());
    }
}
