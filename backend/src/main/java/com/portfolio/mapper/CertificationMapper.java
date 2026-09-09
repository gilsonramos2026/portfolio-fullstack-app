package com.portfolio.mapper;

import com.portfolio.domain.Certification;
import com.portfolio.dto.certification.CertificationRequestDTO;
import com.portfolio.dto.certification.CertificationResponseDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CertificationMapper {

    public Certification toEntity(CertificationRequestDTO dto) {
        return Certification.builder()
                .name(dto.name())
                .issuer(dto.issuer())
                .issueDate(dto.issueDate())
                .expirationDate(dto.expirationDate())
                .credentialUrl(dto.credentialUrl())
                .imageUrl(dto.imageUrl())
                .displayOrder(dto.displayOrder())
                .build();
    }

    public void updateEntityFromDto(CertificationRequestDTO dto, Certification certification) {
        certification.setName(dto.name());
        certification.setIssuer(dto.issuer());
        certification.setIssueDate(dto.issueDate());
        certification.setExpirationDate(dto.expirationDate());
        certification.setCredentialUrl(dto.credentialUrl());
        certification.setImageUrl(dto.imageUrl());
        certification.setDisplayOrder(dto.displayOrder());
    }

    public CertificationResponseDTO toResponseDTO(Certification certification) {
        return new CertificationResponseDTO(
                certification.getId(), certification.getName(), certification.getIssuer(),
                certification.getIssueDate(), certification.getExpirationDate(),
                certification.getCredentialUrl(), certification.getImageUrl(),
                certification.getDisplayOrder(), certification.getCreatedAt(), certification.getUpdatedAt());
    }

    public List<CertificationResponseDTO> toResponseDTOList(List<Certification> items) {
        return items.stream().map(this::toResponseDTO).toList();
    }
}
