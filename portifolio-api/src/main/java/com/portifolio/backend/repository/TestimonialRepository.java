package com.portifolio.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portifolio.backend.model.Testimonial;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findByActiveTrueOrderBySortOrderAsc();
    List<Testimonial> findByActiveTrueAndFeaturedTrueOrderBySortOrderAsc();
}
 

