package com.portifolio.backend.dto.project;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectImageResponse {
    private Long id;
    private String url;
    private String altText;
    private Integer sortOrder;
}
