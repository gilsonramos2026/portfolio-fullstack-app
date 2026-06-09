package com.portifolio.backend.dto.experience;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class ExperienceRequest {

    // CORREÇÃO: Atributos alterados para private seguindo as boas práticas de encapsulamento
    @NotBlank 
    @Size(max = 150) 
    private String company;

    @NotBlank 
    @Size(max = 150) 
    private String role;

    @NotBlank 
    private String description;

    @Size(max = 500) 
    private String logoUrl;

    @Size(max = 100) 
    private String location;

    private String type;

    @NotNull 
    private LocalDate startedAt;

    private LocalDate endedAt;

    private Boolean current;

    private Integer sortOrder;

    private Boolean active;

    private Set<String> technologies;
}
