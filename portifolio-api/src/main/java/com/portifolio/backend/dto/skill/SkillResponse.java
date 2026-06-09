package com.portifolio.backend.dto.skill;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkillResponse {
    private Long id;
    private String name;
    private String category;
    private String iconName;
    private Integer proficiency;
    private Integer sortOrder;
}

