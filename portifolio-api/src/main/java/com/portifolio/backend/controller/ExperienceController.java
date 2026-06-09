package com.portifolio.backend.controller;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.portifolio.backend.dto.experience.ExperienceRequest;
import com.portifolio.backend.dto.experience.ExperienceResponse;
import com.portifolio.backend.service.ExperienceService;

@RestController
@RequestMapping("/experiences")
public class ExperienceController {

    @Autowired
    private ExperienceService experienceService;

    // ============================================================================
    // FEED PÚBLICO
    // ============================================================================
    @Tag(name = "Público - Experiências")
    @Operation(summary = "Listar experiências profissionais")
    @GetMapping
    public ResponseEntity<List<ExperienceResponse>> getExperiences() {
        return ResponseEntity.ok(experienceService.getPublicExperiences());
    }

    // ============================================================================
    // OPERAÇÕES ADMINISTRATIVAS (Protegidas)
    // ============================================================================
    @Tag(name = "Admin - Experiências")
    @Operation(summary = "Listar todas as experiências (admin)")
    @GetMapping("/all")
    public ResponseEntity<List<ExperienceResponse>> listExperiences(@RequestHeader("X-Admin-Key") String key) {
        return ResponseEntity.ok(experienceService.getAllExperiencesAdmin(key));
    }

    @Tag(name = "Admin - Experiências")
    @Operation(summary = "Criar nova experiência")
    @PostMapping
    public ResponseEntity<ExperienceResponse> createExperience(
            @RequestHeader("X-Admin-Key") String key, @Valid @RequestBody ExperienceRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(experienceService.createExperienceAdmin(key, req));
    }

    @Tag(name = "Admin - Experiências")
    @Operation(summary = "Atualizar uma experiência")
    @PutMapping("/{id}")
    public ResponseEntity<ExperienceResponse> updateExperience(
            @RequestHeader("X-Admin-Key") String key,
            @PathVariable Long id, @Valid @RequestBody ExperienceRequest req) {
        return ResponseEntity.ok(experienceService.updateExperienceAdmin(key, id, req));
    }

    @Tag(name = "Admin - Experiências")
    @Operation(summary = "Desativar uma experiência (soft delete)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@RequestHeader("X-Admin-Key") String key, @PathVariable Long id) {
        experienceService.deleteExperienceAdmin(key, id);
        return ResponseEntity.noContent().build();
    }
}

