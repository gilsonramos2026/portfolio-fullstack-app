package com.portifolio.backend.dto.certification;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class CertificationRequest {

    @NotBlank @Size(max=200) 
    private String name;

    @NotBlank @Size(max=150) 
    private String issuer;

    @Size(max=200) 
    private String credentialId;

    @Size(max=500) 
    private String credentialUrl;

    @Size(max=500) 
    private String imageUrl;

    @NotNull 
    private LocalDate issuedAt;

    private LocalDate expiresAt;

    private Boolean active;

    private Integer sortOrder;
}
