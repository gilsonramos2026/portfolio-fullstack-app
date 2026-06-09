package com.portifolio.backend.service;

import java.util.List;
import com.portifolio.backend.dto.education.EducationRequest;
import com.portifolio.backend.dto.education.EducationResponse;

public interface EducationService {
    List<EducationResponse> getPublicEducations();
    List<EducationResponse> getAllEducationsAdmin(String key);
    EducationResponse createEducationAdmin(String key, EducationRequest req);
    EducationResponse updateEducationAdmin(String key, Long id, EducationRequest req);
    void deleteEducationAdmin(String key, Long id);
}

