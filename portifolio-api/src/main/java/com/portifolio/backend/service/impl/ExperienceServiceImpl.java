package com.portifolio.backend.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.portifolio.backend.repository.ExperienceRepository;
import com.portifolio.backend.service.ExperienceService;
import com.portifolio.backend.dto.experience.ExperienceRequest;
import com.portifolio.backend.dto.experience.ExperienceResponse;
import com.portifolio.backend.mapper.ExperienceMapper;
import com.portifolio.backend.model.Experience;

@Service
public class ExperienceServiceImpl implements ExperienceService {

    @Autowired
    private ExperienceRepository experienceRepo;

    @Autowired
    private ExperienceMapper experienceMapper;

    @Value("${app.admin.secret-key:portfolio-admin-key-2026}")
    private String adminSecretKey;

    private void checkAdminKey(String key) {
        if (key == null || !key.equals(adminSecretKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrative access denied. Invalid key.");
        }
    }

    @Override
    public List<ExperienceResponse> getPublicExperiences() {
        return experienceRepo.findByActiveTrueOrderBySortOrderAscStartedAtDesc()
                .stream()
                .map(experienceMapper::toResponse)
                .toList();
    }

    @Override
    public List<ExperienceResponse> getAllExperiencesAdmin(String key) {
        checkAdminKey(key);
        return experienceRepo.findAll().stream().map(experienceMapper::toResponse).toList();
    }

    @Override
    public ExperienceResponse createExperienceAdmin(String key, ExperienceRequest req) {
        checkAdminKey(key);
        Experience e = new Experience();
        experienceMapper.updateEntity(e, req);
        return experienceMapper.toResponse(experienceRepo.save(e));
    }

    @Override
    public ExperienceResponse updateExperienceAdmin(String key, Long id, ExperienceRequest req) {
        checkAdminKey(key);
        Experience e = experienceRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Experience not found."));
        experienceMapper.updateEntity(e, req);
        return experienceMapper.toResponse(experienceRepo.save(e));
    }

    @Override
    public void deleteExperienceAdmin(String key, Long id) {
        checkAdminKey(key);
        Experience e = experienceRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Experience not found."));
        e.setActive(false); // Soft Delete
        experienceRepo.save(e);
    }
}

