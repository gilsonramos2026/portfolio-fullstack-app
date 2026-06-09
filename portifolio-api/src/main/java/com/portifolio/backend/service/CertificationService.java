package com.portifolio.backend.service;

import java.util.List;
import com.portifolio.backend.dto.certification.CertificationRequest;
import com.portifolio.backend.dto.certification.CertificationResponse;

public interface CertificationService {
    List<CertificationResponse> getPublicCertifications();
    List<CertificationResponse> getAllCertificationsAdmin(String key);
    CertificationResponse createCertification(String key, CertificationRequest req);
    CertificationResponse updateCertification(String key, Long id, CertificationRequest req);
    void deleteCertification(String key, Long id);
}

