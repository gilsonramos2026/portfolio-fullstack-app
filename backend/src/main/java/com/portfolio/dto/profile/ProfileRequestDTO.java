package com.portfolio.dto.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Payload de entrada para criação/atualização (upsert) do perfil.
 * Utilizado exclusivamente em rotas administrativas protegidas.
 */
public record ProfileRequestDTO(

        @Schema(description = "Nome completo exibido publicamente", example = "Maria da Silva")
        @NotBlank(message = "O nome completo é obrigatório")
        @Size(max = 150, message = "O nome completo deve ter no máximo 150 caracteres")
        String fullName,

        @Schema(description = "Título/headline profissional", example = "Desenvolvedora Full-Stack Júnior")
        @Size(max = 200, message = "O headline deve ter no máximo 200 caracteres")
        String headline,

        @Schema(description = "Biografia/resumo profissional")
        @Size(max = 4000, message = "A biografia deve ter no máximo 4000 caracteres")
        String bio,

        @Schema(description = "URL pública da foto de perfil")
        @Size(max = 500, message = "A URL da foto deve ter no máximo 500 caracteres")
        String photoUrl,

        @Schema(description = "E-mail de contato", example = "maria@exemplo.com")
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "E-mail inválido")
        @Size(max = 150)
        String email,

        @Schema(description = "Telefone de contato", example = "+55 41 90000-0000")
        @Pattern(regexp = "^$|^[0-9()+\\-\\s]{8,30}$", message = "Telefone inválido")
        String phone,

        @Schema(description = "URL do GitHub")
        @Size(max = 300)
        String githubUrl,

        @Schema(description = "URL do LinkedIn")
        @Size(max = 300)
        String linkedinUrl,

        @Schema(description = "URL do Instagram")
        @Size(max = 300)
        String instagramUrl,

        @Schema(description = "URL do X (Twitter)")
        @Size(max = 300)
        String twitterUrl,

        @Schema(description = "URL do site/portfolio pessoal")
        @Size(max = 300)
        String websiteUrl,

        @Schema(description = "URL pública do currículo em PDF", example = "https://.../curriculo.pdf")
        @Size(max = 500, message = "A URL do currículo deve ter no máximo 500 caracteres")
        String resumeUrl,

        @Schema(description = "Cargos/títulos alternados no efeito de máquina de escrever do hero. "
                + "Se vazia, o frontend usa apenas 'headline'.",
                example = "[\"Desenvolvedor Full Stack\", \"Engenheiro de Software\"]")
        java.util.List<@NotBlank @Size(max = 80) String> roles,

        @Schema(description = "Indica se está disponível para novas oportunidades")
        boolean availableForWork
) {
}
