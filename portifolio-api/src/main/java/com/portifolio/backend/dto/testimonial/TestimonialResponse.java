package com.portifolio.backend.dto.testimonial;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TestimonialResponse {
    
    private Long id;
    private String name;
    private String role;
    private String company;
    private String content;
    private String avatarUrl;
    private Integer rating;
    private Integer sortOrder;
    private Boolean featured;
}

