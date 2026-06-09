package com.portifolio.backend.mapper;

import org.springframework.stereotype.Component;
import com.portifolio.backend.dto.education.EducationRequest;
import com.portifolio.backend.dto.education.EducationResponse;
import com.portifolio.backend.model.Education;

@Component
public class EducationMapper {

    public EducationResponse toResponse(Education ed) {
        if (ed == null) return null;
        return EducationResponse.builder()
                .id(ed.getId())
                .institution(ed.getInstitution())
                .degree(ed.getDegree())
                .fieldOfStudy(ed.getFieldOfStudy())
                .description(ed.getDescription())
                .logoUrl(ed.getLogoUrl())
                .grade(ed.getGrade())
                .startedAt(ed.getStartedAt())
                .endedAt(ed.getEndedAt())
                .current(ed.getCurrent())
                .sortOrder(ed.getSortOrder())
                .build();
    }

    public void updateEntity(Education ed, EducationRequest req) {
        if (req == null) return;
        ed.setInstitution(req.getInstitution());
        ed.setDegree(req.getDegree());
        ed.setFieldOfStudy(req.getFieldOfStudy());
        ed.setDescription(req.getDescription());
        ed.setLogoUrl(req.getLogoUrl());
        ed.setGrade(req.getGrade());
        ed.setStartedAt(req.getStartedAt());
        ed.setEndedAt(req.getEndedAt());
        
        if (req.getCurrent() != null) ed.setCurrent(req.getCurrent());
        if (req.getSortOrder() != null) ed.setSortOrder(req.getSortOrder());
        if (req.getActive() != null) ed.setActive(req.getActive());
    }
}
