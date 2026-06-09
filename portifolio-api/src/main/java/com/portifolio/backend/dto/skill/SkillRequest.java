package com.portifolio.backend.dto.skill;

import jakarta.validation.constraints.*;
import lombok.*;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class SkillRequest {

    // CORREÇÃO: Atributos alterados para private seguindo as boas práticas de encapsulamento
    @NotBlank 
    @Size(max = 80) 
    private String name;

    @NotBlank 
    @Size(max = 60) 
    private String category;

    @NotNull 
    @Min(1) 
    @Max(100) 
    private Integer proficiency;

    @Size(max = 80) 
    private String iconName;

    private Integer sortOrder;
    
    private Boolean active;
}

