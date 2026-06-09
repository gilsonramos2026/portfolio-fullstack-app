package com.portifolio.backend.dto.education;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.time.LocalDate;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EducationResponse {
    private Long id;
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String description;
    private String logoUrl;
    private String grade;
    private LocalDate startedAt;
    private LocalDate endedAt;
    private Boolean current;
    private Integer sortOrder;
}

