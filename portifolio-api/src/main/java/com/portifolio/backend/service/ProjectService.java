package com.portifolio.backend.service;

import java.util.List;
import com.portifolio.backend.dto.project.ProjectRequest;
import com.portifolio.backend.dto.project.ProjectResponse;

public interface ProjectService {
    List<ProjectResponse> getPublicProjects(Boolean featured);
    ProjectResponse getPublicProjectBySlug(String slug);
    List<ProjectResponse> getAllProjectsAdmin(String key);
    ProjectResponse createProjectAdmin(String key, ProjectRequest req);
    ProjectResponse updateProjectAdmin(String key, Long id, ProjectRequest req);
    void deleteProjectAdmin(String key, Long id);
}

