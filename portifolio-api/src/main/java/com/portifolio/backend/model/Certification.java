package com.portifolio.backend.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name = "certifications")
@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class Certification {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200) private 
    String name;

    @Column(nullable = false, length = 150) 
    private String issuer;

    @Column(name = "credential_id", length = 200) 
    private String credentialId;

    @Column(name = "credential_url", length = 500) 
    private String credentialUrl;

    @Column(name = "image_url", length = 500) private 
    String imageUrl;

    @Column(name = "issued_at", nullable = false) 
    private LocalDate issuedAt;

    @Column(name = "expires_at") private 
    LocalDate expiresAt;

    @Column(nullable = false) 
    private Boolean active = true;

    @Column(name = "sort_order") 
    private Integer sortOrder = 0;

    @Column(name = "created_at") 
    private LocalDateTime createdAt;

    @PrePersist protected void onCreate() { 
      createdAt = LocalDateTime.now(); 
   }
}

