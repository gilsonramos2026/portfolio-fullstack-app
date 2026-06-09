package com.portifolio.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portifolio.backend.model.Project;


@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByActiveTrueOrderBySortOrderAscCreatedAtDesc();
    List<Project> findByActiveTrueAndFeaturedTrueOrderBySortOrderAsc();
    Optional<Project> findBySlugAndActiveTrue(String slug);
}
