package com.portifolio.backend.mapper;

import org.springframework.stereotype.Component;
import com.portifolio.backend.dto.testimonial.TestimonialRequest;
import com.portifolio.backend.dto.testimonial.TestimonialResponse;
import com.portifolio.backend.model.Testimonial;

@Component
public class TestimonialMapper {

    public TestimonialResponse toResponse(Testimonial t) {
        if (t == null) return null;
        return TestimonialResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .role(t.getRole())
                .company(t.getCompany())
                .content(t.getContent())
                .avatarUrl(t.getAvatarUrl())
                .rating(t.getRating())
                .sortOrder(t.getSortOrder())
                .featured(t.getFeatured())
                .build();
    }

    public void updateEntity(Testimonial t, TestimonialRequest req) {
        if (req == null) return;
        t.setName(req.getName());
        t.setRole(req.getRole());
        t.setCompany(req.getCompany());
        t.setContent(req.getContent());
        t.setAvatarUrl(req.getAvatarUrl());
        t.setRating(req.getRating());
        
        if (req.getFeatured() != null) t.setFeatured(req.getFeatured());
        if (req.getActive() != null) t.setActive(req.getActive());
        if (req.getSortOrder() != null) t.setSortOrder(req.getSortOrder());
    }
}
