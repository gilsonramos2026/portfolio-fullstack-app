package com.portifolio.backend.service;

import java.util.List;
import com.portifolio.backend.dto.experience.ExperienceRequest;
import com.portifolio.backend.dto.experience.ExperienceResponse;

public interface ExperienceService {
    List<ExperienceResponse> getPublicExperiences();
    List<ExperienceResponse> getAllExperiencesAdmin(String key);
    ExperienceResponse createExperienceAdmin(String key, ExperienceRequest req);
    ExperienceResponse updateExperienceAdmin(String key, Long id, ExperienceRequest req);
    void deleteExperienceAdmin(String key, Long id);
}

