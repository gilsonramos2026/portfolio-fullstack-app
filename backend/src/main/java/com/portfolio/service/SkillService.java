package com.portfolio.service;

import com.portfolio.backend.dto.skill.SkillRequestDTO;
import com.portfolio.backend.dto.skill.SkillResponseDTO;

import java.util.List;

public interface SkillService {
    List<SkillResponseDTO> listSkills();
    SkillResponseDTO createSkill(SkillRequestDTO requestDTO);
    SkillResponseDTO updateSkill(Long id, SkillRequestDTO requestDTO);
    void deleteSkill(Long id);
}
