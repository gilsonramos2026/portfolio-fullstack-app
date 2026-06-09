package com.portifolio.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portifolio.backend.model.Certification;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByActiveTrueOrderBySortOrderAscIssuedAtDesc();
}
