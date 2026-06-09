package com.portifolio.backend.service;

import java.util.List;
import com.portifolio.backend.dto.testimonial.TestimonialRequest;
import com.portifolio.backend.dto.testimonial.TestimonialResponse;

public interface TestimonialService {
    List<TestimonialResponse> getPublicTestimonials(Boolean featured);
    List<TestimonialResponse> getAllTestimonialsAdmin(String key);
    TestimonialResponse createTestimonialAdmin(String key, TestimonialRequest req);
    TestimonialResponse updateTestimonialAdmin(String key, Long id, TestimonialRequest req);
    void deleteTestimonialAdmin(String key, Long id);
}

