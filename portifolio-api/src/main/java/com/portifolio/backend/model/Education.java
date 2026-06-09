package com.portifolio.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name = "educations")
@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class Education {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150) 
    private String institution;

    @Column(nullable = false, length = 100) 
    private String degree;

    @Column(name = "field_of_study", length = 150) 
    private String fieldOfStudy;

    @Column(columnDefinition = "TEXT") 
    private String description;

    @Column(name = "logo_url", length = 500) 
    private String logoUrl;

    @Column(length = 30) 
    private String grade;

    @Column(name = "started_at", nullable = false) 
    private LocalDate startedAt;

    @Column(name = "ended_at") 
    private LocalDate endedAt;

    @Builder.Default
    @Column(nullable = false) 
    private Boolean current = false;

    @Builder.Default
    @Column(name = "sort_order") 
    private Integer sortOrder = 0;

    @Builder.Default
    @Column(nullable = false) 
    private Boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist 
    protected void onCreate() { 
        createdAt = LocalDateTime.now(); 
    }
}
