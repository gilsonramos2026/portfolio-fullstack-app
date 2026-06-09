package com.portifolio.backend.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.portifolio.backend.repository.CertificationRepository;
import com.portifolio.backend.service.CertificationService;
import com.portifolio.backend.dto.certification.CertificationRequest;
import com.portifolio.backend.dto.certification.CertificationResponse;
import com.portifolio.backend.mapper.CertificationMapper;
import com.portifolio.backend.model.Certification;

@Service
public class CertificationServiceImpl implements CertificationService {

    @Autowired
    private CertificationRepository certificationRepo;

    @Autowired
    private CertificationMapper certificationMapper;

    @Value("${app.admin.secret-key:portfolio-admin-key-2026}")
    private String adminSecretKey;

    private void checkAdminKey(String key) {
        if (key == null || !key.equals(adminSecretKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrative access denied. Invalid key.");
        }
    }

    @Override
    public List<CertificationResponse> getPublicCertifications() {
        return certificationRepo.findByActiveTrueOrderBySortOrderAscIssuedAtDesc()
                .stream()
                .map(certificationMapper::toResponse)
                .toList();
    }

    @Override
    public List<CertificationResponse> getAllCertificationsAdmin(String key) {
        checkAdminKey(key);
        return certificationRepo.findAll()
                .stream()
                .map(certificationMapper::toResponse)
                .toList();
    }

    @Override
    public CertificationResponse createCertification(String key, CertificationRequest req) {
        checkAdminKey(key);
        Certification c = new Certification();
        certificationMapper.updateEntity(c, req);
        return certificationMapper.toResponse(certificationRepo.save(c));
    }

    @Override
    public CertificationResponse updateCertification(String key, Long id, CertificationRequest req) {
        checkAdminKey(key);
        Certification c = certificationRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certification not found."));
        certificationMapper.updateEntity(c, req);
        return certificationMapper.toResponse(certificationRepo.save(c));
    }

    @Override
    public void deleteCertification(String key, Long id) {
        checkAdminKey(key);
        Certification c = certificationRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certification not found."));
        c.setActive(false); // Soft Delete
        certificationRepo.save(c);
    }
}

