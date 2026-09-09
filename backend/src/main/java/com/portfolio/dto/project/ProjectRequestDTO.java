package com.portfolio.dto.project;

import com.portfolio.domain.enums.ProjectStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Payload de entrada para criação/atualização de um projeto.
 * Utilizado exclusivamente em rotas administrativas protegidas.
 */
public record ProjectRequestDTO(

        @Schema(description = "Título do projeto", example = "API de Gestão de Portfólio")
        @NotBlank(message = "O título é obrigatório")
        @Size(max = 150)
        String title,

        @Schema(description = "Descrição curta exibida em listagens/cards")
        @NotBlank(message = "A descrição curta é obrigatória")
        @Size(max = 300)
        String shortDescription,

        @Schema(description = "Descrição completa/detalhada do projeto")
        @Size(max = 8000)
        String description,

        @Size(max = 300)
        String repositoryUrl,

        @Size(max = 300)
        String demoUrl,

        @Size(max = 500)
        String imageUrl,

        @NotNull(message = "O status do projeto é obrigatório")
        ProjectStatus status,

        boolean featured,

        @PositiveOrZero(message = "A ordem de exibição não pode ser negativa")
        int displayOrder,

        LocalDate startDate,

        LocalDate endDate,

        @Schema(description = "Lista de tecnologias utilizadas", example = "[\"Java\", \"Spring Boot\", \"PostgreSQL\"]")
        @NotEmpty(message = "Informe ao menos uma tecnologia utilizada")
        List<@NotBlank @Size(max = 60) String> techStack
) {
}
