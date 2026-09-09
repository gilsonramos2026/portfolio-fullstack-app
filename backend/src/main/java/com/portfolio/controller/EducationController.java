package com.portfolio.controller;

import com.portfolio.dto.education.EducationRequestDTO;
import com.portfolio.dto.education.EducationResponseDTO;
import com.portfolio.service.EducationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Formação acadêmica exibida na página Sobre, em timeline.
 * GET é público. POST, PUT e DELETE exigem X-Admin-Token.
 */
@RestController
@RequestMapping("/api/educations")
@Tag(name = "Education", description = "Formação acadêmica")
public class EducationController {

    private final EducationService educationService;

    public EducationController(EducationService educationService) {
        this.educationService = educationService;
    }

    @GetMapping
    @Operation(summary = "Listar formações acadêmicas", description = "Rota pública.")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public ResponseEntity<List<EducationResponseDTO>> listEducations() {
        return ResponseEntity.ok(educationService.listEducations());
    }

    @PostMapping
    @Operation(summary = "Criar formação acadêmica (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "201", description = "Formação criada com sucesso")
    @ApiResponse(responseCode = "401", description = "Token administrativo ausente ou inválido")
    public ResponseEntity<EducationResponseDTO> createEducation(@Valid @RequestBody EducationRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(educationService.createEducation(requestDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar formação acadêmica (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "200", description = "Formação atualizada com sucesso")
    @ApiResponse(responseCode = "404", description = "Formação não encontrada")
    public ResponseEntity<EducationResponseDTO> updateEducation(
            @Parameter(description = "ID da formação") @PathVariable Long id,
            @Valid @RequestBody EducationRequestDTO requestDTO) {
        return ResponseEntity.ok(educationService.updateEducation(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover formação acadêmica (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "204", description = "Formação removida com sucesso")
    @ApiResponse(responseCode = "404", description = "Formação não encontrada")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id) {
        educationService.deleteEducation(id);
        return ResponseEntity.noContent().build();
    }
}
