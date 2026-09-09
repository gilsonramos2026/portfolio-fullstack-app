package com.portfolio.service;

import com.portfolio.backend.dto.project.ProjectRequestDTO;
import com.portfolio.backend.dto.project.ProjectResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Regras de negócio para o CRUD completo de projetos.
 */
public interface ProjectService {

    Page<ProjectResponseDTO> listProjects(Pageable pageable);

    Page<ProjectResponseDTO> listFeaturedProjects(Pageable pageable);

    ProjectResponseDTO getProjectById(Long id);

    ProjectResponseDTO createProject(ProjectRequestDTO requestDTO);

    ProjectResponseDTO updateProject(Long id, ProjectRequestDTO requestDTO);

    void deleteProject(Long id);
}
