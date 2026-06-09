package com.portifolio.backend.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.portifolio.backend.repository.ProjectRepository;
import com.portifolio.backend.service.ProjectService;
import com.portifolio.backend.dto.project.ProjectRequest;
import com.portifolio.backend.dto.project.ProjectResponse;
import com.portifolio.backend.mapper.ProjectMapper;
import com.portifolio.backend.model.Project;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private ProjectMapper projectMapper;

    @Value("${app.admin.secret-key:portfolio-admin-key-2026}")
    private String adminSecretKey;

    private void checkAdminKey(String key) {
        if (key == null || !key.equals(adminSecretKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrative access denied. Invalid key.");
        }
    }

    @Override
    public List<ProjectResponse> getPublicProjects(Boolean featured) {
        List<Project> projects = (featured != null && featured)
                ? projectRepo.findByActiveTrueAndFeaturedTrueOrderBySortOrderAsc()
                : projectRepo.findByActiveTrueOrderBySortOrderAscCreatedAtDesc();
        return projects.stream().map(projectMapper::toResponse).toList();
    }

    @Override
    public ProjectResponse getPublicProjectBySlug(String slug) {
        Project p = projectRepo.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found."));
        return projectMapper.toResponse(p);
    }

    @Override
    public List<ProjectResponse> getAllProjectsAdmin(String key) {
        checkAdminKey(key);
        return projectRepo.findAll().stream().map(projectMapper::toResponse).toList();
    }

    @Override
    public ProjectResponse createProjectAdmin(String key, ProjectRequest req) {
        checkAdminKey(key);
        Project p = new Project();
        projectMapper.updateEntity(p, req);
        p.setActive(true);
        return projectMapper.toResponse(projectRepo.save(p));
    }

    @Override
    public ProjectResponse updateProjectAdmin(String key, Long id, ProjectRequest req) {
        checkAdminKey(key);
        Project p = projectRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found."));
        projectMapper.updateEntity(p, req);
        return projectMapper.toResponse(projectRepo.save(p));
    }

    @Override
    public void deleteProjectAdmin(String key, Long id) {
        checkAdminKey(key);
        Project p = projectRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found."));
        p.setActive(false); // Soft Delete
        projectRepo.save(p);
    }
}
