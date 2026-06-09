package com.portifolio.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.portifolio.backend.model.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByActiveTrueOrderBySortOrderAscNameAsc();
    
    @Query("SELECT DISTINCT s.category FROM Skill s WHERE s.active = true ORDER BY s.category")
    List<String> findDistinctCategories();
}

