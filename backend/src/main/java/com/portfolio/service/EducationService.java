package com.portfolio.service;

import com.portfolio.backend.dto.education.EducationRequestDTO;
import com.portfolio.backend.dto.education.EducationResponseDTO;

import java.util.List;

public interface EducationService {
    List<EducationResponseDTO> listEducations();
    EducationResponseDTO createEducation(EducationRequestDTO requestDTO);
    EducationResponseDTO updateEducation(Long id, EducationRequestDTO requestDTO);
    void deleteEducation(Long id);
}
