package com.portifolio.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "experiences")
@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class Experience {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String company;

    @Column(nullable = false, length = 150)
    private String role;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(length = 100)
    private String location;

    @Builder.Default
    @Column(length = 40, nullable = false)
    private String type = "full_time";

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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "experience_technologies",
            joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "technology")
    @Builder.Default
    private Set<String> technologies = new HashSet<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist 
    protected void onCreate() { 
        createdAt = LocalDateTime.now(); 
    }
}

