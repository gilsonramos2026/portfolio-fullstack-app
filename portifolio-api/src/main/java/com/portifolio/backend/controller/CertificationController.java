package com.portifolio.backend.controller;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.portifolio.backend.dto.certification.CertificationRequest;
import com.portifolio.backend.dto.certification.CertificationResponse;
import com.portifolio.backend.service.CertificationService;

@RestController
@RequestMapping("/certifications")
public class CertificationController {

    @Autowired
    private CertificationService certificationService;

    @Tag(name = "Público - Certificações")
    @Operation(summary = "Listar certificações publicamente")
    @GetMapping
    public ResponseEntity<List<CertificationResponse>> getCertifications() {
        return ResponseEntity.ok(certificationService.getPublicCertifications());
    }

    @Tag(name = "Admin - Certificações")
    @Operation(summary = "Listar todas as certificações (Admin)")
    @GetMapping("/all")
    public ResponseEntity<List<CertificationResponse>> listCertifications(@RequestHeader("X-Admin-Key") String key) {
        return ResponseEntity.ok(certificationService.getAllCertificationsAdmin(key));
    }

    @Tag(name = "Admin - Certificações")
    @Operation(summary = "Criar nova certificação")
    @PostMapping
    public ResponseEntity<CertificationResponse> createCertification(
            @RequestHeader("X-Admin-Key") String key, @Valid @RequestBody CertificationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(certificationService.createCertification(key, req));
    }

    @Tag(name = "Admin - Certificações")
    @Operation(summary = "Atualizar uma certificação")
    @PutMapping("/{id}")
    public ResponseEntity<CertificationResponse> updateCertification(
            @RequestHeader("X-Admin-Key") String key,
            @PathVariable Long id, @Valid @RequestBody CertificationRequest req) {
        return ResponseEntity.ok(certificationService.updateCertification(key, id, req));
    }

    @Tag(name = "Admin - Certificações")
    @Operation(summary = "Deletar ou desativar uma certificação")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertification(@RequestHeader("X-Admin-Key") String key, @PathVariable Long id) {
        certificationService.deleteCertification(key, id);
        return ResponseEntity.noContent().build();
    }
}

