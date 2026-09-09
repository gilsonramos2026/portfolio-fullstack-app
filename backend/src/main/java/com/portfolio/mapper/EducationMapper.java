package com.portfolio.mapper;

import com.portfolio.domain.Education;
import com.portfolio.dto.education.EducationRequestDTO;
import com.portfolio.dto.education.EducationResponseDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EducationMapper {

    public Education toEntity(EducationRequestDTO dto) {
        return Education.builder()
                .institution(dto.institution())
                .degree(dto.degree())
                .fieldOfStudy(dto.fieldOfStudy())
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .description(dto.description())
                .displayOrder(dto.displayOrder())
                .build();
    }

    public void updateEntityFromDto(EducationRequestDTO dto, Education education) {
        education.setInstitution(dto.institution());
        education.setDegree(dto.degree());
        education.setFieldOfStudy(dto.fieldOfStudy());
        education.setStartDate(dto.startDate());
        education.setEndDate(dto.endDate());
        education.setDescription(dto.description());
        education.setDisplayOrder(dto.displayOrder());
    }

    public EducationResponseDTO toResponseDTO(Education education) {
        return new EducationResponseDTO(
                education.getId(), education.getInstitution(), education.getDegree(),
                education.getFieldOfStudy(), education.getStartDate(), education.getEndDate(),
                education.getDescription(), education.getDisplayOrder(),
                education.getCreatedAt(), education.getUpdatedAt());
    }

    public List<EducationResponseDTO> toResponseDTOList(List<Education> items) {
        return items.stream().map(this::toResponseDTO).toList();
    }
}
