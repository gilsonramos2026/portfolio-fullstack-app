package com.portifolio.backend.dto.profile;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import java.time.LocalDateTime;

// ============================================================
// PROFILE RESPONSE
// ============================================================
@Schema(description = "Dados de resposta do perfil público e administrativo")
@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProfileResponse {
    private Long id;
    private String name;
    private String title;
    private String tagline;
    private String bio;
    private String email;
    private String phone;
    private String location;
    private String avatarUrl;
    private String resumeUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String twitterUrl;
    private String websiteUrl;
    private Integer yearsExp;
    private Boolean available;
    private LocalDateTime updatedAt;
}

