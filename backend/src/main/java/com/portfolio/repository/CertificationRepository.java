package com.portfolio.repository;

import com.portfolio.domain.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findAllByOrderByDisplayOrderAscIssueDateDesc();
}
