package com.portifolio.backend.dto.project;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class ProjectRequest {

    @NotBlank 
    @Size(max = 150) 
    private String title;

    @NotBlank 
    @Size(max = 300) 
    private String shortDesc;

    @NotBlank 
    private String description;

    @Size(max = 500) 
    private String thumbnailUrl;

    @Size(max = 300) 
    private String demoUrl;

    @Size(max = 300) 
    private String githubUrl;

    private Boolean featured;
    private String status;
    private Integer sortOrder;
    private Set<String> tags;
    private LocalDate startedAt;
    private LocalDate finishedAt;
}

