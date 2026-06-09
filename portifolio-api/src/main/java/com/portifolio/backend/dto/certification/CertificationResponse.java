package com.portifolio.backend.dto.certification;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.time.LocalDate;

@Data 
@Builder 
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CertificationResponse {

    private Long id;
    private String name;
    private String issuer;
    private String credentialId;
    private String credentialUrl;
    private String imageUrl;
    private LocalDate issuedAt;
    private LocalDate expiresAt;
    private Integer sortOrder;
}
