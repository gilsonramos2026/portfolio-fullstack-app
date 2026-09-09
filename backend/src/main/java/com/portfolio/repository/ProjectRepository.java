package com.portfolio.repository;

import com.portfolio.domain.Project;
import com.portfolio.domain.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);

    Page<Project> findByFeaturedTrue(Pageable pageable);
}
