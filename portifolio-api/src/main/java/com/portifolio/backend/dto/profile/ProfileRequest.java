package com.portifolio.backend.dto.profile;

import jakarta.validation.constraints.*;
import lombok.*;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class ProfileRequest {

    // CORREÇÃO: Atributos alterados para private seguindo as boas práticas de encapsulamento
    @NotBlank 
    @Size(max = 100) 
    private String name;

    @NotBlank 
    @Size(max = 150) 
    private String title;

    @Size(max = 255) 
    private String tagline;

    @NotBlank 
    private String bio;

    @NotBlank 
    @Email 
    @Size(max = 100) 
    private String email;

    @Size(max = 30) 
    private String phone;

    @Size(max = 100) 
    private String location;

    @Size(max = 500) 
    private String avatarUrl;

    @Size(max = 500) 
    private String resumeUrl;

    @Size(max = 300) 
    private String githubUrl;

    @Size(max = 300) 
    private String linkedinUrl;

    @Size(max = 300) 
    private String twitterUrl;

    @Size(max = 300) 
    private String websiteUrl;

    @Min(0) 
    @Max(60) 
    private Integer yearsExp;

    private Boolean available;
}
