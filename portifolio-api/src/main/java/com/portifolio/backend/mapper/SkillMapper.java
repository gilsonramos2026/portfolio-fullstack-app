package com.portifolio.backend.mapper;

import org.springframework.stereotype.Component;
import com.portifolio.backend.dto.skill.SkillRequest;
import com.portifolio.backend.dto.skill.SkillResponse;
import com.portifolio.backend.model.Skill;

@Component
public class SkillMapper {

    public SkillResponse toResponse(Skill s) {
        if (s == null) return null;
        return SkillResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .category(s.getCategory())
                .iconName(s.getIconName())
                .proficiency(s.getProficiency())
                .sortOrder(s.getSortOrder())
                .build();
    }

    public void updateEntity(Skill s, SkillRequest req) {
        if (req == null) return;
        s.setName(req.getName());
        s.setCategory(req.getCategory());
        s.setProficiency(req.getProficiency());
        s.setIconName(req.getIconName());
        
        if (req.getSortOrder() != null) s.setSortOrder(req.getSortOrder());
        if (req.getActive() != null) s.setActive(req.getActive());
    }
}
