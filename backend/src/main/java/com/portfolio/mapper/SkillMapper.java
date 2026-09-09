package com.portfolio.mapper;

import com.portfolio.domain.Skill;
import com.portfolio.dto.skill.SkillRequestDTO;
import com.portfolio.dto.skill.SkillResponseDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SkillMapper {

    public Skill toEntity(SkillRequestDTO dto) {
        return Skill.builder()
                .name(dto.name())
                .category(dto.category())
                .proficiency(dto.proficiency())
                .displayOrder(dto.displayOrder())
                .build();
    }

    public void updateEntityFromDto(SkillRequestDTO dto, Skill skill) {
        skill.setName(dto.name());
        skill.setCategory(dto.category());
        skill.setProficiency(dto.proficiency());
        skill.setDisplayOrder(dto.displayOrder());
    }

    public SkillResponseDTO toResponseDTO(Skill skill) {
        return new SkillResponseDTO(
                skill.getId(), skill.getName(), skill.getCategory(), skill.getProficiency(),
                skill.getDisplayOrder(), skill.getCreatedAt(), skill.getUpdatedAt());
    }

    public List<SkillResponseDTO> toResponseDTOList(List<Skill> skills) {
        return skills.stream().map(this::toResponseDTO).toList();
    }
}
