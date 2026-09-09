package com.portfolio.dto.profile;

import com.portfolio.dto.address.AddressResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Representação pública do perfil, retornada nos endpoints de leitura.
 */
public record ProfileResponseDTO(
        Long id,
        String fullName,
        String headline,
        String bio,
        String photoUrl,
        String email,
        String phone,
        String githubUrl,
        String linkedinUrl,
        String instagramUrl,
        String twitterUrl,
        String websiteUrl,
        String resumeUrl,
        java.util.List<String> roles,
        boolean availableForWork,
        List<AddressResponseDTO> addresses,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
