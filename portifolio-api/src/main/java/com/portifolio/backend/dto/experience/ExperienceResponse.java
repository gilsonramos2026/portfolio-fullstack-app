package com.portifolio.backend.dto.experience;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExperienceResponse {
    private Long id;
    private String company;
    private String role;
    private String description;
    private String logoUrl;
    private String location;
    private String type;
    private LocalDate startedAt;
    private LocalDate endedAt;
    private Boolean current;
    private Integer sortOrder;
    private Set<String> technologies;
}
