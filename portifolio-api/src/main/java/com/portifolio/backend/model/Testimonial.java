package com.portifolio.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "testimonials")
@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class Testimonial {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100) 
    private String name;
    
    @Column(nullable = false, length = 150) 
    private String role;
    
    @Column(length = 150) 
    private String company;
    
    @Column(nullable = false, columnDefinition = "TEXT") 
    private String content;
    
    @Column(name = "avatar_url", length = 500) 
    private String avatarUrl;
    
    @Builder.Default
    @Column(nullable = false) 
    private Integer rating = 5;
    
    @Builder.Default
    @Column(nullable = false) 
    private Boolean featured = false;
    
    @Builder.Default
    @Column(nullable = false) 
    private Boolean active = true;
    
    @Builder.Default
    @Column(name = "sort_order") 
    private Integer sortOrder = 0;
    
    @Column(name = "created_at", updatable = false) // Protege a data de registro original
    private LocalDateTime createdAt;
    
    @PrePersist 
    protected void onCreate() { 
        createdAt = LocalDateTime.now(); 
    }
}

