package com.portifolio.backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.portifolio.backend.dto.profile.ProfileRequest;
import com.portifolio.backend.dto.profile.ProfileResponse;
import com.portifolio.backend.service.ProfileService;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Tag(name = "Público - Perfil")
    @Operation(summary = "Obter perfil", description = "Retorna os dados públicos do perfil")
    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile() {
        return ResponseEntity.ok(profileService.getPublicProfile());
    }

    @Tag(name = "Admin - Perfil")
    @Operation(summary = "Atualizar perfil", description = "Atualiza os dados do perfil. Cria se não existir.")
    @PutMapping
    public ResponseEntity<ProfileResponse> upsertProfile(
            @Parameter(description = "Chave admin", required = true) @RequestHeader("X-Admin-Key") String key,
            @Valid @RequestBody ProfileRequest req) {
        return ResponseEntity.ok(profileService.upsertProfile(key, req));
    }
}
