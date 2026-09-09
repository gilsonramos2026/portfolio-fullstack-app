package com.portfolio.controller;

import com.portfolio.dto.certification.CertificationRequestDTO;
import com.portfolio.dto.certification.CertificationResponseDTO;
import com.portfolio.service.CertificationService;
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
 * Certificações profissionais exibidas na página Sobre.
 * GET é público. POST, PUT e DELETE exigem X-Admin-Token.
 */
@RestController
@RequestMapping("/api/certifications")
@Tag(name = "Certifications", description = "Certificações profissionais")
public class CertificationController {

    private final CertificationService certificationService;

    public CertificationController(CertificationService certificationService) {
        this.certificationService = certificationService;
    }

    @GetMapping
    @Operation(summary = "Listar certificações", description = "Rota pública.")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public ResponseEntity<List<CertificationResponseDTO>> listCertifications() {
        return ResponseEntity.ok(certificationService.listCertifications());
    }

    @PostMapping
    @Operation(summary = "Criar certificação (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "201", description = "Certificação criada com sucesso")
    @ApiResponse(responseCode = "401", description = "Token administrativo ausente ou inválido")
    public ResponseEntity<CertificationResponseDTO> createCertification(
            @Valid @RequestBody CertificationRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(certificationService.createCertification(requestDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar certificação (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "200", description = "Certificação atualizada com sucesso")
    @ApiResponse(responseCode = "404", description = "Certificação não encontrada")
    public ResponseEntity<CertificationResponseDTO> updateCertification(
            @Parameter(description = "ID da certificação") @PathVariable Long id,
            @Valid @RequestBody CertificationRequestDTO requestDTO) {
        return ResponseEntity.ok(certificationService.updateCertification(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover certificação (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "204", description = "Certificação removida com sucesso")
    @ApiResponse(responseCode = "404", description = "Certificação não encontrada")
    public ResponseEntity<Void> deleteCertification(@PathVariable Long id) {
        certificationService.deleteCertification(id);
        return ResponseEntity.noContent().build();
    }
}
