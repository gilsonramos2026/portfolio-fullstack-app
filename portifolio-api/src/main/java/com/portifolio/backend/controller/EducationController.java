package com.portifolio.backend.controller;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.portifolio.backend.dto.education.EducationRequest;
import com.portifolio.backend.dto.education.EducationResponse;
import com.portifolio.backend.service.EducationService;

@RestController
@RequestMapping("/educations")
public class EducationController {

    @Autowired
    private EducationService educationService;

    // ============================================================================
    // FEED PÚBLICO
    // ============================================================================
    @Tag(name = "Público - Educação")
    @Operation(summary = "Listar formação acadêmica")
    @GetMapping
    public ResponseEntity<List<EducationResponse>> getEducations() {
        return ResponseEntity.ok(educationService.getPublicEducations());
    }

    // ============================================================================
    // OPERAÇÕES ADMINISTRATIVAS (Protegidas)
    // ============================================================================
    @Tag(name = "Admin - Educação")
    @Operation(summary = "Listar todas as formações (admin)")
    @GetMapping("/all")
    public ResponseEntity<List<EducationResponse>> listEducations(@RequestHeader("X-Admin-Key") String key) {
        return ResponseEntity.ok(educationService.getAllEducationsAdmin(key));
    }

    @Tag(name = "Admin - Educação")
    @Operation(summary = "Criar nova formação")
    @PostMapping
    public ResponseEntity<EducationResponse> createEducation(
            @RequestHeader("X-Admin-Key") String key, @Valid @RequestBody EducationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(educationService.createEducationAdmin(key, req));
    }

    @Tag(name = "Admin - Educação")
    @Operation(summary = "Atualizar uma formação")
    @PutMapping("/{id}")
    public ResponseEntity<EducationResponse> updateEducation(
            @RequestHeader("X-Admin-Key") String key,
            @PathVariable Long id, @Valid @RequestBody EducationRequest req) {
               return ResponseEntity.ok(educationService.updateEducationAdmin(key, id, req));
    }

    @Tag(name = "Admin - Educação")
    @Operation(summary = "Deletar uma formação")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@RequestHeader("X-Admin-Key") String key, @PathVariable Long id) {
        educationService.deleteEducationAdmin(key, id);
        return ResponseEntity.noContent().build();
    }
}
