package com.portifolio.backend.dto.education;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class EducationRequest {

    @NotBlank 
    @Size(max = 150) 
    private String institution;

    @NotBlank 
    @Size(max = 100) 
    private String degree;

    @Size(max = 150) 
    private String fieldOfStudy;

    private String description;

    @Size(max = 500) 
    private String logoUrl;

    @Size(max = 30) 
    private String grade;

    @NotNull 
    private LocalDate startedAt;

    private LocalDate endedAt;
    
    private Boolean current;
    
    private Integer sortOrder;
    
    private Boolean active;
}

