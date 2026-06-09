package com.portifolio.backend.controller;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.portifolio.backend.dto.testimonial.TestimonialRequest;
import com.portifolio.backend.dto.testimonial.TestimonialResponse;
import com.portifolio.backend.service.TestimonialService;

@RestController
@RequestMapping("/testimonials")
public class TestimonialController {

    @Autowired
    private TestimonialService testimonialService;

    // ============================================================================
    // FEEDS PÚBLICOS
    // ============================================================================
    @Tag(name = "Público - Testemunhos")
    @Operation(summary = "Listar depoimentos")
    @GetMapping
    public ResponseEntity<List<TestimonialResponse>> getTestimonials(
            @RequestParam(required = false) Boolean featured) {
        return ResponseEntity.ok(testimonialService.getPublicTestimonials(featured));
    }

    // ============================================================================
    // OPERAÇÕES ADMINISTRATIVAS (Protegidas)
    // ============================================================================
    @Tag(name = "Admin - Testemunhos")
    @Operation(summary = "Listar todos os testemunhos (admin)")
    @GetMapping("/all") // Diferenciado para não dar conflito de rotas
    public ResponseEntity<List<TestimonialResponse>> listTestimonials(@RequestHeader("X-Admin-Key") String key) {
        return ResponseEntity.ok(testimonialService.getAllTestimonialsAdmin(key));
    }

    @Tag(name = "Admin - Testemunhos")
    @Operation(summary = "Criar testemunho")
    @PostMapping
    public ResponseEntity<TestimonialResponse> createTestimonial(
            @RequestHeader("X-Admin-Key") String key, @Valid @RequestBody TestimonialRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(testimonialService.createTestimonialAdmin(key, req));
    }

    @Tag(name = "Admin - Testemunhos")
    @Operation(summary = "Atualizar testemunho")
    @PutMapping("/{id}")
    public ResponseEntity<TestimonialResponse> updateTestimonial(
            @RequestHeader("X-Admin-Key") String key,
            @PathVariable Long id, @Valid @RequestBody TestimonialRequest req) {
        return ResponseEntity.ok(testimonialService.updateTestimonialAdmin(key, id, req));
    }

    @Tag(name = "Admin - Testemunhos")
    @Operation(summary = "Deletar testemunho")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestimonial(@RequestHeader("X-Admin-Key") String key, @PathVariable Long id) {
        testimonialService.deleteTestimonialAdmin(key, id);
        return ResponseEntity.noContent().build();
    }
}
