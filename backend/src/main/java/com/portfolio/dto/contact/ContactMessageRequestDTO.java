package com.portfolio.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactMessageRequestDTO(

        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 150)
        String name,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "E-mail inválido")
        @Size(max = 150)
        String email,

        @NotBlank(message = "A mensagem é obrigatória")
        @Size(max = 2000, message = "A mensagem deve ter no máximo 2000 caracteres")
        String message,

        /**
         * Campo honeypot anti-spam: invisível para humanos via CSS no
         * frontend, mas frequentemente preenchido por bots automatizados.
         * Se vier preenchido, o Service aceita a requisição (200/201,
         * para não sinalizar ao bot que foi detectado) mas descarta a
         * mensagem silenciosamente, sem persistir nem notificar o Admin.
         */
        String website
) {
}
