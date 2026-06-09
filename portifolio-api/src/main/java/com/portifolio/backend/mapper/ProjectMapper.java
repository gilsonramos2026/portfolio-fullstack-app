package com.portifolio.backend.mapper;

import org.springframework.stereotype.Component;
import com.portifolio.backend.dto.project.ProjectRequest;
import com.portifolio.backend.dto.project.ProjectResponse;
import com.portifolio.backend.model.Project;
import com.portifolio.backend.dto.project.ProjectImageResponse;

@Component
public class ProjectMapper {

    // 1. Método que converte a Entidade do banco para o DTO de saída do Front-end
    public ProjectResponse toResponse(Project p) {
        if (p == null) return null;
        
        return ProjectResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .slug(p.getSlug())
                .shortDesc(p.getShortDesc())
                .description(p.getDescription())
                .thumbnailUrl(p.getThumbnailUrl())
                .demoUrl(p.getDemoUrl())
                .githubUrl(p.getGithubUrl())
                .featured(p.getFeatured())
                .status(p.getStatus())
                .sortOrder(p.getSortOrder())
                .tags(p.getTags())
                // Converte a lista de entidades ProjectImage para DTOs ProjectImageResponse
                .images(p.getImages() != null ? p.getImages().stream()
                        .map(i -> ProjectImageResponse.builder()
                                .id(i.getId())
                                .url(i.getUrl())
                                .altText(i.getAltText())
                                .sortOrder(i.getSortOrder())
                                .build())
                        .toList() : null)
                .startedAt(p.getStartedAt())
                .finishedAt(p.getFinishedAt())
                .createdAt(p.getCreatedAt())
                .build();
    }

    // 2. Método complementar indispensável para operações de Create e Update do Admin
    public void updateEntity(Project p, ProjectRequest req) {
        if (req == null) return;
        
        p.setTitle(req.getTitle());
        // REGRA DE NEGÓCIO: Cria automaticamente um slug limpo (ex: "Meu Projeto" vira "meu-projeto")
        p.setSlug(req.getTitle().toLowerCase().trim()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-"));
                
        p.setShortDesc(req.getShortDesc());
        p.setDescription(req.getDescription());
        p.setThumbnailUrl(req.getThumbnailUrl());
        p.setDemoUrl(req.getDemoUrl());
        p.setGithubUrl(req.getGithubUrl());
        p.setStartedAt(req.getStartedAt());
        p.setFinishedAt(req.getFinishedAt());
        
        if (req.getFeatured() != null) p.setFeatured(req.getFeatured());
        if (req.getStatus() != null) p.setStatus(req.getStatus());
        if (req.getSortOrder() != null) p.setSortOrder(req.getSortOrder());
        if (req.getTags() != null) p.setTags(req.getTags());
    }
}

