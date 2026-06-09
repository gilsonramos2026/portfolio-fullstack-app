package com.portifolio.backend.mapper;

import org.springframework.stereotype.Component;
import com.portifolio.backend.dto.experience.ExperienceRequest;
import com.portifolio.backend.dto.experience.ExperienceResponse;
import com.portifolio.backend.model.Experience;

@Component
public class ExperienceMapper {

    public ExperienceResponse toResponse(Experience e) {
        if (e == null) return null;
        return ExperienceResponse.builder()
                .id(e.getId())
                .company(e.getCompany())
                .role(e.getRole())
                .description(e.getDescription())
                .logoUrl(e.getLogoUrl())
                .location(e.getLocation())
                .type(e.getType())
                .startedAt(e.getStartedAt())
                .endedAt(e.getEndedAt())
                .current(e.getCurrent())
                .sortOrder(e.getSortOrder())
                .technologies(e.getTechnologies())
                .build();
    }

    public void updateEntity(Experience e, ExperienceRequest req) {
        if (req == null) return;
        e.setCompany(req.getCompany());
        e.setRole(req.getRole());
        e.setDescription(req.getDescription());
        e.setLogoUrl(req.getLogoUrl());
        e.setLocation(req.getLocation());
        e.setStartedAt(req.getStartedAt());
        e.setEndedAt(req.getEndedAt());
        
        if (req.getType() != null) e.setType(req.getType());
        if (req.getCurrent() != null) e.setCurrent(req.getCurrent());
        if (req.getSortOrder() != null) e.setSortOrder(req.getSortOrder());
        if (req.getActive() != null) e.setActive(req.getActive());
        if (req.getTechnologies() != null) e.setTechnologies(req.getTechnologies());
    }
}
