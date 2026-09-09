package com.portfolio.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Endpoint dedicado exclusivamente à validação do token administrativo pela
 * tela de login do frontend. Não possui efeito colateral: se a requisição
 * chegou até aqui, o {@code AdminTokenFilter} já validou o header
 * {@code X-Admin-Token} (POST é um método protegido), então basta confirmar
 * 200 OK. Qualquer token ausente/inválido já teria sido barrado com 401
 * antes de chegar neste método.
 */
@RestController
@RequestMapping("/api/admin/session")
@Tag(name = "Admin Session", description = "Validação de sessão administrativa")
public class AdminSessionController {

    @PostMapping("/validate")
    @Operation(
            summary = "Valida o token administrativo",
            description = "Usado pela tela de login do painel. Retorna 200 se o header "
                    + "X-Admin-Token for válido; o AdminTokenFilter responde 401 automaticamente caso contrário.",
            security = @SecurityRequirement(name = "X-Admin-Token")
    )
    @ApiResponse(responseCode = "200", description = "Token válido")
    @ApiResponse(responseCode = "401", description = "Token ausente ou inválido")
    public ResponseEntity<Map<String, Object>> validate() {
        return ResponseEntity.ok(Map.of(
                "valid", true,
                "timestamp", Instant.now().toString()
        ));
    }
}
