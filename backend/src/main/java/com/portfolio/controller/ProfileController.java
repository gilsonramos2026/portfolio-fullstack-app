package com.portfolio.controller;

import com.portfolio.dto.profile.ProfileRequestDTO;
import com.portfolio.dto.profile.ProfileResponseDTO;
import com.portfolio.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints do perfil (dados pessoais e foto).
 *
 * <p>GET é público. PUT é administrativo e exige o header
 * {@code X-Admin-Token} (validado pelo {@code AdminTokenFilter}).</p>
 */
@RestController
@RequestMapping("/api/profile")
@Tag(name = "Profile", description = "Gestão dos dados pessoais, foto de perfil e contatos principais")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    @Operation(summary = "Consultar o perfil público",
            description = "Rota pública. Retorna os dados pessoais, foto e contatos exibidos no portfolio.")
    @ApiResponse(responseCode = "200", description = "Perfil retornado com sucesso")
    public ResponseEntity<ProfileResponseDTO> getProfile() {
        return ResponseEntity.ok(profileService.getProfile());
    }

    @PutMapping
    @Operation(summary = "Atualizar o perfil (Admin)",
            description = "Rota administrativa protegida por X-Admin-Token. Cria ou atualiza (upsert) "
                    + "os dados pessoais, foto de perfil e contatos principais.",
            security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "200", description = "Perfil atualizado com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @ApiResponse(responseCode = "401", description = "Token administrativo ausente ou inválido")
    public ResponseEntity<ProfileResponseDTO> upsertProfile(@Valid @RequestBody ProfileRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(profileService.upsertProfile(requestDTO));
    }
}
