package com.portifolio.backend.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.portifolio.backend.repository.EducationRepository;
import com.portifolio.backend.service.EducationService;
import com.portifolio.backend.dto.education.EducationRequest;
import com.portifolio.backend.dto.education.EducationResponse;
import com.portifolio.backend.mapper.EducationMapper;
import com.portifolio.backend.model.Education;

@Service
public class EducationServiceImpl implements EducationService {

    @Autowired
    private EducationRepository educationRepo;

    @Autowired
    private EducationMapper educationMapper;

    @Value("${app.admin.secret-key:portfolio-admin-key-2026}")
    private String adminSecretKey;

    private void checkAdminKey(String key) {
        if (key == null || !key.equals(adminSecretKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrative access denied. Invalid key.");
        }
    }

    @Override
    public List<EducationResponse> getPublicEducations() {
        return educationRepo.findByActiveTrueOrderBySortOrderAscStartedAtDesc()
                .stream()
                .map(educationMapper::toResponse)
                .toList();
    }

    @Override
    public List<EducationResponse> getAllEducationsAdmin(String key) {
        checkAdminKey(key);
        return educationRepo.findAll().stream().map(educationMapper::toResponse).toList();
    }

    @Override
    public EducationResponse createEducationAdmin(String key, EducationRequest req) {
        checkAdminKey(key);
        Education ed = new Education();
        educationMapper.updateEntity(ed, req);
        return educationMapper.toResponse(educationRepo.save(ed));
    }

    @Override
    public EducationResponse updateEducationAdmin(String key, Long id, EducationRequest req) {
        checkAdminKey(key);
        Education ed = educationRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Education entry not found."));
        educationMapper.updateEntity(ed, req);
        return educationMapper.toResponse(educationRepo.save(ed));
    }

    @Override
    public void deleteEducationAdmin(String key, Long id) {
        checkAdminKey(key);
        if (!educationRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Education entry not found.");
        }
        educationRepo.deleteById(id);
    }
}
