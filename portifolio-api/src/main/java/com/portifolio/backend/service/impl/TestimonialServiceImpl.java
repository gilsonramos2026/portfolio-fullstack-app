package com.portifolio.backend.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.portifolio.backend.repository.TestimonialRepository;
import com.portifolio.backend.service.TestimonialService;
import com.portifolio.backend.dto.testimonial.TestimonialRequest;
import com.portifolio.backend.dto.testimonial.TestimonialResponse;
import com.portifolio.backend.mapper.TestimonialMapper;
import com.portifolio.backend.model.Testimonial;

@Service
public class TestimonialServiceImpl implements TestimonialService {

    @Autowired
    private TestimonialRepository testimonialRepo;

    @Autowired
    private TestimonialMapper testimonialMapper;

    @Value("${app.admin.secret-key:portfolio-admin-key-2026}")
    private String adminSecretKey;

    private void checkAdminKey(String key) {
        if (key == null || !key.equals(adminSecretKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrative access denied. Invalid key.");
        }
    }

    @Override
    public List<TestimonialResponse> getPublicTestimonials(Boolean featured) {
        List<Testimonial> list = (featured != null && featured)
                ? testimonialRepo.findByActiveTrueAndFeaturedTrueOrderBySortOrderAsc()
                : testimonialRepo.findByActiveTrueOrderBySortOrderAsc();
        return list.stream().map(testimonialMapper::toResponse).toList();
    }

    @Override
    public List<TestimonialResponse> getAllTestimonialsAdmin(String key) {
        checkAdminKey(key);
        return testimonialRepo.findAll().stream().map(testimonialMapper::toResponse).toList();
    }

    @Override
    public TestimonialResponse createTestimonialAdmin(String key, TestimonialRequest req) {
        checkAdminKey(key);
        Testimonial t = new Testimonial();
        testimonialMapper.updateEntity(t, req);
        return testimonialMapper.toResponse(testimonialRepo.save(t));
    }

    @Override
    public TestimonialResponse updateTestimonialAdmin(String key, Long id, TestimonialRequest req) {
        checkAdminKey(key);
        Testimonial t = testimonialRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Testimonial not found."));
        testimonialMapper.updateEntity(t, req);
        return testimonialMapper.toResponse(testimonialRepo.save(t));
    }

    @Override
    public void deleteTestimonialAdmin(String key, Long id) {
        checkAdminKey(key);
        if (!testimonialRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Testimonial not found.");
        }
        testimonialRepo.deleteById(id);
    }
}
