package com.portifolio.backend.controller;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.portifolio.backend.dto.project.ProjectRequest;
import com.portifolio.backend.dto.project.ProjectResponse;
import com.portifolio.backend.service.ProjectService;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // ============================================================================
    // FEEDS PÚBLICOS
    // ============================================================================
    @Tag(name = "Público - Projetos")
    @Operation(summary = "Listar projetos")
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @Parameter(description = "Apenas destaques?") @RequestParam(required = false) Boolean featured) {
        return ResponseEntity.ok(projectService.getPublicProjects(featured));
    }

    @Tag(name = "Público - Projetos")
    @Operation(summary = "Detalhe do projeto por slug")
    @GetMapping("/{slug}")
    public ResponseEntity<ProjectResponse> getProjectBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(projectService.getPublicProjectBySlug(slug));
    }

    // ============================================================================
    // OPERAÇÕES ADMINISTRATIVAS (Protegidas)
    // ============================================================================
    @Tag(name = "Admin - Projetos")
    @Operation(summary = "Listar todos os projetos (admin)")
    @GetMapping("/all") // Rota ajustada para diferenciar do GET público
    public ResponseEntity<List<ProjectResponse>> listProjects(
            @RequestHeader("X-Admin-Key") String key) {
        return ResponseEntity.ok(projectService.getAllProjectsAdmin(key));
    }

    @Tag(name = "Admin - Projetos")
    @Operation(summary = "Criar projeto")
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @RequestHeader("X-Admin-Key") String key,
            @Valid @RequestBody ProjectRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProjectAdmin(key, req));
    }

    @Tag(name = "Admin - Projetos")
    @Operation(summary = "Atualizar projeto")
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @RequestHeader("X-Admin-Key") String key,
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest req) {
        return ResponseEntity.ok(projectService.updateProjectAdmin(key, id, req));
    }

    @Tag(name = "Admin - Projetos")
    @Operation(summary = "Deletar projeto (soft delete)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @RequestHeader("X-Admin-Key") String key, @PathVariable Long id) {
        projectService.deleteProjectAdmin(key, id);
        return ResponseEntity.noContent().build();
    }
}
