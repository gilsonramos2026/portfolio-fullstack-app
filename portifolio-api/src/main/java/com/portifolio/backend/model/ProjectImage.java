package com.portifolio.backend.model; // CORREÇÃO: Alinhado com o pacote unificado

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore; // Importante para evitar loop no JSON

@Entity
@Table(name = "project_images")
@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class ProjectImage {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore // Evita loop infinito na conversão para JSON
    private Project project;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "alt_text", length = 200)
    private String altText;

    @Builder.Default
    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist 
    protected void onCreate() { 
        createdAt = LocalDateTime.now(); 
    }
}
