package com.portifolio.backend.controller;

import java.util.List;
import java.util.Map;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.portifolio.backend.dto.skill.SkillRequest;
import com.portifolio.backend.dto.skill.SkillResponse;
import com.portifolio.backend.service.SkillService;

@RestController
@RequestMapping("/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    // ============================================================================
    // FEED PÚBLICO - Agrupado de forma inteligente para o seu site
    // ============================================================================
    @Tag(name = "Público - Skills")
    @Operation(summary = "Listar habilidades agrupadas por categoria")
    @GetMapping
    public ResponseEntity<Map<String, List<SkillResponse>>> getSkills() {
        return ResponseEntity.ok(skillService.getPublicGroupedSkills());
    }

    // ============================================================================
    // OPERAÇÕES ADMINISTRATIVAS (Protegidas)
    // ============================================================================
    @Tag(name = "Admin - Skills")
    @Operation(summary = "Listar todas as habilidades (admin)")
    @GetMapping("/all")
    public ResponseEntity<List<SkillResponse>> listSkills(@RequestHeader("X-Admin-Key") String key) {
        return ResponseEntity.ok(skillService.getAllSkillsAdmin(key));
    }

    @Tag(name = "Admin - Skills")
    @Operation(summary = "Criar nova habilidade")
    @PostMapping
    public ResponseEntity<SkillResponse> createSkill(
            @RequestHeader("X-Admin-Key") String key, @Valid @RequestBody SkillRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(skillService.createSkillAdmin(key, req));
    }

    @Tag(name = "Admin - Skills")
    @Operation(summary = "Atualizar uma habilidade")
    @PutMapping("/{id}")
    public ResponseEntity<SkillResponse> updateSkill(
            @RequestHeader("X-Admin-Key") String key,
            @PathVariable Long id, @Valid @RequestBody SkillRequest req) {
        return ResponseEntity.ok(skillService.updateSkillAdmin(key, id, req));
    }

    @Tag(name = "Admin - Skills")
    @Operation(summary = "Deletar uma habilidade")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@RequestHeader("X-Admin-Key") String key, @PathVariable Long id) {
        skillService.deleteSkillAdmin(key, id);
        return ResponseEntity.noContent().build();
    }
}

