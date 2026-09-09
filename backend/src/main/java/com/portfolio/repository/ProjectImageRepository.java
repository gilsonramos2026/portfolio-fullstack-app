package com.portfolio.repository;

import com.portfolio.domain.ProjectImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectImageRepository extends JpaRepository<ProjectImage, Long> {
    Optional<ProjectImage> findByIdAndProjectId(Long id, Long projectId);
}
