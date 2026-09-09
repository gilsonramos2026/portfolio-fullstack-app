package com.portfolio.controller;

import com.portfolio.dto.project.ProjectRequestDTO;
import com.portfolio.dto.project.ProjectResponseDTO;
import com.portfolio.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints do CRUD completo de projetos.
 *
 * <p>GET (listagem paginada, destaques e detalhe) é público.
 * POST, PUT e DELETE são administrativos e exigem o header
 * {@code X-Admin-Token}.</p>
 */
@RestController
@RequestMapping("/api/projects")
@Tag(name = "Projects", description = "CRUD completo de projetos do portfolio")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "Listar projetos (paginado)",
            description = "Rota pública. Suporta paginação e ordenação via query params "
                    + "(?page=0&size=10&sort=displayOrder,asc).")
    @ApiResponse(responseCode = "200", description = "Página de projetos retornada com sucesso")
    public ResponseEntity<Page<ProjectResponseDTO>> listProjects(
            @PageableDefault(size = 10, sort = "displayOrder", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(projectService.listProjects(pageable));
    }

    @GetMapping("/featured")
    @Operation(summary = "Listar projetos em destaque (paginado)",
            description = "Rota pública. Retorna apenas os projetos marcados como 'featured'.")
    @ApiResponse(responseCode = "200", description = "Página de projetos em destaque retornada com sucesso")
    public ResponseEntity<Page<ProjectResponseDTO>> listFeaturedProjects(
            @PageableDefault(size = 10, sort = "displayOrder", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(projectService.listFeaturedProjects(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar projeto por ID", description = "Rota pública.")
    @ApiResponse(responseCode = "200", description = "Projeto encontrado")
    @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
    public ResponseEntity<ProjectResponseDTO> getProjectById(
            @Parameter(description = "ID do projeto") @PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    @Operation(summary = "Criar projeto (Admin)",
            description = "Rota administrativa protegida por X-Admin-Token.",
            security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "201", description = "Projeto criado com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @ApiResponse(responseCode = "401", description = "Token administrativo ausente ou inválido")
    public ResponseEntity<ProjectResponseDTO> createProject(@Valid @RequestBody ProjectRequestDTO requestDTO) {
        ProjectResponseDTO created = projectService.createProject(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar projeto (Admin)",
            security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "200", description = "Projeto atualizado com sucesso")
    @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
    public ResponseEntity<ProjectResponseDTO> updateProject(
            @Parameter(description = "ID do projeto") @PathVariable Long id,
            @Valid @RequestBody ProjectRequestDTO requestDTO) {
        return ResponseEntity.ok(projectService.updateProject(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover projeto (Admin)",
            security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "204", description = "Projeto removido com sucesso")
    @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
