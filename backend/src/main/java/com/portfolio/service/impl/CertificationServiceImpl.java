package com.portfolio.service.impl;

import com.portfolio.domain.Certification;
import com.portfolio.dto.certification.CertificationRequestDTO;
import com.portfolio.dto.certification.CertificationResponseDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.CertificationMapper;
import com.portfolio.repository.CertificationRepository;
import com.portfolio.service.CertificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional(readOnly = true)
public class CertificationServiceImpl implements CertificationService {

    private final CertificationRepository certificationRepository;
    private final CertificationMapper certificationMapper;

    public CertificationServiceImpl(CertificationRepository certificationRepository,
                                     CertificationMapper certificationMapper) {
        this.certificationRepository = certificationRepository;
        this.certificationMapper = certificationMapper;
    }

    @Override
    public List<CertificationResponseDTO> listCertifications() {
        return certificationMapper.toResponseDTOList(
                certificationRepository.findAllByOrderByDisplayOrderAscIssueDateDesc());
    }

    @Override
    @Transactional
    public CertificationResponseDTO createCertification(CertificationRequestDTO requestDTO) {
        Certification saved = certificationRepository.save(certificationMapper.toEntity(requestDTO));
        log.info("Certificação criada pelo Admin (id={})", saved.getId());
        return certificationMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public CertificationResponseDTO updateCertification(Long id, CertificationRequestDTO requestDTO) {
        Certification certification = findOrThrow(id);
        certificationMapper.updateEntityFromDto(requestDTO, certification);
        Certification saved = certificationRepository.save(certification);
        log.info("Certificação atualizada pelo Admin (id={})", saved.getId());
        return certificationMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public void deleteCertification(Long id) {
        Certification certification = findOrThrow(id);
        certificationRepository.delete(certification);
        log.info("Certificação removida pelo Admin (id={})", id);
    }

    private Certification findOrThrow(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("Certificação", id));
    }
}
