package com.portfolio.service;

import com.portfolio.dto.certification.CertificationRequestDTO;
import com.portfolio.dto.certification.CertificationResponseDTO;

import java.util.List;

public interface CertificationService {
    List<CertificationResponseDTO> listCertifications();
    CertificationResponseDTO createCertification(CertificationRequestDTO requestDTO);
    CertificationResponseDTO updateCertification(Long id, CertificationRequestDTO requestDTO);
    void deleteCertification(Long id);
}
