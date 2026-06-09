package com.portifolio.backend.dto.testimonial;

import jakarta.validation.constraints.*;
import lombok.*;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class TestimonialRequest {

    @NotBlank 
    @Size(max = 100) 
    private String name;

    @NotBlank 
    @Size(max = 150) 
    private String role;

    @Size(max = 150) 
    private String company;

    @NotBlank 
    private String content;

    @Size(max = 500) 
    private String avatarUrl;

    @Min(1) 
    @Max(5) 
    private Integer rating;

    private Boolean featured;
    private Boolean active;
    private Integer sortOrder;
}
