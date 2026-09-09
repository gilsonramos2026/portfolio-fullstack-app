package com.portfolio.service.impl;

import com.portfolio.backend.domain.Skill;
import com.portfolio.backend.dto.skill.SkillRequestDTO;
import com.portfolio.backend.dto.skill.SkillResponseDTO;
import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.mapper.SkillMapper;
import com.portfolio.backend.repository.SkillRepository;
import com.portfolio.backend.service.SkillService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional(readOnly = true)
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;

    public SkillServiceImpl(SkillRepository skillRepository, SkillMapper skillMapper) {
        this.skillRepository = skillRepository;
        this.skillMapper = skillMapper;
    }

    @Override
    public List<SkillResponseDTO> listSkills() {
        return skillMapper.toResponseDTOList(skillRepository.findAllByOrderByDisplayOrderAscIdAsc());
    }

    @Override
    @Transactional
    public SkillResponseDTO createSkill(SkillRequestDTO requestDTO) {
        Skill saved = skillRepository.save(skillMapper.toEntity(requestDTO));
        log.info("Habilidade criada pelo Admin (id={})", saved.getId());
        return skillMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public SkillResponseDTO updateSkill(Long id, SkillRequestDTO requestDTO) {
        Skill skill = findOrThrow(id);
        skillMapper.updateEntityFromDto(requestDTO, skill);
        Skill saved = skillRepository.save(skill);
        log.info("Habilidade atualizada pelo Admin (id={})", saved.getId());
        return skillMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public void deleteSkill(Long id) {
        Skill skill = findOrThrow(id);
        skillRepository.delete(skill);
        log.info("Habilidade removida pelo Admin (id={})", id);
    }

    private Skill findOrThrow(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("Habilidade", id));
    }
}
