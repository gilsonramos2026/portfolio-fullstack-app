package com.portifolio.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 255)
    private String tagline;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String bio;

    @Column(nullable = false, length = 100, unique = true)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(length = 100)
    private String location;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(name = "github_url", length = 300)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 300)
    private String linkedinUrl;

    @Column(name = "twitter_url", length = 300)
    private String twitterUrl;

    @Column(name = "website_url", length = 300)
    private String websiteUrl;

    @Column(name = "years_exp")
    private Integer yearsExp;

    @Column(nullable = false)
    private Boolean available = true;

    @Column(name = "created_at", updatable = false) // Protege a data de criação original
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
