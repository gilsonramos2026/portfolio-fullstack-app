package com.portfolio.controller;

import com.portfolio.dto.skill.SkillRequestDTO;
import com.portfolio.dto.skill.SkillResponseDTO;
import com.portfolio.service.SkillService;
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
 * Habilidades técnicas exibidas na página Sobre (com nível de proficiência).
 * GET é público. POST, PUT e DELETE exigem X-Admin-Token.
 */
@RestController
@RequestMapping("/api/skills")
@Tag(name = "Skills", description = "Habilidades técnicas com nível de proficiência")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    @Operation(summary = "Listar habilidades", description = "Rota pública, ordenada por displayOrder.")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public ResponseEntity<List<SkillResponseDTO>> listSkills() {
        return ResponseEntity.ok(skillService.listSkills());
    }

    @PostMapping
    @Operation(summary = "Criar habilidade (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "201", description = "Habilidade criada com sucesso")
    @ApiResponse(responseCode = "401", description = "Token administrativo ausente ou inválido")
    public ResponseEntity<SkillResponseDTO> createSkill(@Valid @RequestBody SkillRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(skillService.createSkill(requestDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar habilidade (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "200", description = "Habilidade atualizada com sucesso")
    @ApiResponse(responseCode = "404", description = "Habilidade não encontrada")
    public ResponseEntity<SkillResponseDTO> updateSkill(
            @Parameter(description = "ID da habilidade") @PathVariable Long id,
            @Valid @RequestBody SkillRequestDTO requestDTO) {
        return ResponseEntity.ok(skillService.updateSkill(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover habilidade (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "204", description = "Habilidade removida com sucesso")
    @ApiResponse(responseCode = "404", description = "Habilidade não encontrada")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
