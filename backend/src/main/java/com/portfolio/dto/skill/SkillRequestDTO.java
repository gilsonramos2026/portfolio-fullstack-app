package com.portfolio.dto.skill;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SkillRequestDTO(

        @NotBlank(message = "O nome da habilidade é obrigatório")
        @Size(max = 80)
        String name,

        @Schema(example = "Backend")
        @Size(max = 60)
        String category,

        @Schema(description = "Nível de proficiência de 0 a 100", example = "85")
        @Min(value = 0, message = "A proficiência mínima é 0")
        @Max(value = 100, message = "A proficiência máxima é 100")
        int proficiency,

        int displayOrder
) {
}
