package com.portfolio.service.impl;

import com.portfolio.domain.Education;
import com.portfolio.dto.education.EducationRequestDTO;
import com.portfolio.dto.education.EducationResponseDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.EducationMapper;
import com.portfolio.repository.EducationRepository;
import com.portfolio.service.EducationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional(readOnly = true)
public class EducationServiceImpl implements EducationService {

    private final EducationRepository educationRepository;
    private final EducationMapper educationMapper;

    public EducationServiceImpl(EducationRepository educationRepository, EducationMapper educationMapper) {
        this.educationRepository = educationRepository;
        this.educationMapper = educationMapper;
    }

    @Override
    public List<EducationResponseDTO> listEducations() {
        return educationMapper.toResponseDTOList(educationRepository.findAllByOrderByDisplayOrderAscStartDateDesc());
    }

    @Override
    @Transactional
    public EducationResponseDTO createEducation(EducationRequestDTO requestDTO) {
        Education saved = educationRepository.save(educationMapper.toEntity(requestDTO));
        log.info("Formação acadêmica criada pelo Admin (id={})", saved.getId());
        return educationMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public EducationResponseDTO updateEducation(Long id, EducationRequestDTO requestDTO) {
        Education education = findOrThrow(id);
        educationMapper.updateEntityFromDto(requestDTO, education);
        Education saved = educationRepository.save(education);
        log.info("Formação acadêmica atualizada pelo Admin (id={})", saved.getId());
        return educationMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public void deleteEducation(Long id) {
        Education education = findOrThrow(id);
        educationRepository.delete(education);
        log.info("Formação acadêmica removida pelo Admin (id={})", id);
    }

    private Education findOrThrow(Long id) {
        return educationRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("Formação acadêmica", id));
    }
}
