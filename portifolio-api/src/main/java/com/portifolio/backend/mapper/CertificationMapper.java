package com.portifolio.backend.mapper;


import org.springframework.stereotype.Component;
import com.portifolio.backend.dto.certification.CertificationRequest;
import com.portifolio.backend.dto.certification.CertificationResponse;
import com.portifolio.backend.model.Certification;

@Component
public class CertificationMapper {

    public CertificationResponse toResponse(Certification c) {
        if (c == null) return null;
        return CertificationResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .issuer(c.getIssuer())
                .credentialId(c.getCredentialId())
                .credentialUrl(c.getCredentialUrl())
                .imageUrl(c.getImageUrl())
                .issuedAt(c.getIssuedAt())
                .expiresAt(c.getExpiresAt())
                .sortOrder(c.getSortOrder())
                .build();
    }

    public void updateEntity(Certification c, CertificationRequest req) {
        if (req == null) return;
        c.setName(req.getName());
        c.setIssuer(req.getIssuer());
        c.setCredentialId(req.getCredentialId());
        c.setCredentialUrl(req.getCredentialUrl());
        c.setImageUrl(req.getImageUrl());
        c.setIssuedAt(req.getIssuedAt());
        c.setExpiresAt(req.getExpiresAt());
        if (req.getActive() != null) c.setActive(req.getActive());
        if (req.getSortOrder() != null) c.setSortOrder(req.getSortOrder());
    }
}
