package com.portfolio.dto.education;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record EducationRequestDTO(

        @NotBlank(message = "A instituição é obrigatória")
        @Size(max = 150)
        String institution,

        @NotBlank(message = "O curso/grau é obrigatório")
        @Size(max = 150)
        String degree,

        @Size(max = 150)
        String fieldOfStudy,

        @NotNull(message = "A data de início é obrigatória")
        LocalDate startDate,

        /** Nulo = em andamento. */
        LocalDate endDate,

        String description,

        int displayOrder
) {
}
