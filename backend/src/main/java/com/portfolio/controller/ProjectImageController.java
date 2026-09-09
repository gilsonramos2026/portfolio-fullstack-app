package com.portfolio.controller;

import com.portfolio.dto.project.ProjectImageResponseDTO;
import com.portfolio.service.ProjectImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Galeria de imagens (screenshots) de um projeto — sub-recurso de
 * {@code /api/projects/{projectId}}. Todas as rotas são de mutação e,
 * portanto, protegidas pelo {@code AdminTokenFilter}.
 */
@RestController
@RequestMapping("/api/projects/{projectId}/images")
@Tag(name = "Project Images", description = "Galeria de screenshots de um projeto")
public class ProjectImageController {

    private final ProjectImageService projectImageService;

    public ProjectImageController(ProjectImageService projectImageService) {
        this.projectImageService = projectImageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Adicionar screenshot ao projeto (Admin)",
            description = "Aceita JPG, PNG ou WEBP. A primeira imagem (displayOrder=0) é exibida como capa.",
            security = @SecurityRequirement(name = "X-Admin-Token")
    )
    @ApiResponse(responseCode = "201", description = "Imagem adicionada com sucesso")
    @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
    public ResponseEntity<ProjectImageResponseDTO> addImage(
            @Parameter(description = "ID do projeto") @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectImageService.addImage(projectId, file));
    }

    @DeleteMapping("/{imageId}")
    @Operation(summary = "Remover screenshot do projeto (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "204", description = "Imagem removida com sucesso")
    @ApiResponse(responseCode = "404", description = "Imagem não encontrada")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long projectId,
            @PathVariable Long imageId) {
        projectImageService.deleteImage(projectId, imageId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    @Operation(
            summary = "Reordenar screenshots do projeto (Admin)",
            description = "Recebe a lista de IDs de imagem na nova ordem desejada (arrastar-e-soltar no frontend).",
            security = @SecurityRequirement(name = "X-Admin-Token")
    )
    @ApiResponse(responseCode = "200", description = "Ordem atualizada com sucesso")
    public ResponseEntity<List<ProjectImageResponseDTO>> reorderImages(
            @PathVariable Long projectId,
            @RequestBody List<Long> orderedImageIds) {
        return ResponseEntity.ok(projectImageService.reorderImages(projectId, orderedImageIds));
    }
}
