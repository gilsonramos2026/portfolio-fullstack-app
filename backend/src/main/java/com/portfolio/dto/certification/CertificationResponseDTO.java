package com.portfolio.dto.certification;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CertificationResponseDTO(
        Long id,
        String name,
        String issuer,
        LocalDate issueDate,
        LocalDate expirationDate,
        String credentialUrl,
        String imageUrl,
        int displayOrder,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
