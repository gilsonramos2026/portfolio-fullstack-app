package com.portifolio.backend.dto.project;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectResponse {
    private Long id;
    private String title;
    private String slug;
    private String shortDesc;
    private String description;
    private String thumbnailUrl;
    private String demoUrl;
    private String githubUrl;
    private Boolean featured;
    private String status;
    private Integer sortOrder;
    private Set<String> tags;
    private List<ProjectImageResponse> images;
    private LocalDate startedAt;
    private LocalDate finishedAt;
    private LocalDateTime createdAt;
}

