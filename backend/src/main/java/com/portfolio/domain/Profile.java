package com.portfolio.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Representa os dados pessoais/públicos do dono do portfolio.
 *
 * <p>Entidade tratada como "singleton" na aplicação: existe uma única
 * linha, atualizada (upsert) pelo Admin. Contém a foto de perfil e os
 * links de contato principais. Endereços/contatos adicionais residem
 * em {@link Address}.</p>
 */
@Entity
@Table(name = "profile")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "headline", length = 200)
    private String headline;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "github_url", length = 300)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 300)
    private String linkedinUrl;

    @Column(name = "website_url", length = 300)
    private String websiteUrl;

    @Column(name = "instagram_url", length = 300)
    private String instagramUrl;

    @Column(name = "twitter_url", length = 300)
    private String twitterUrl;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    /**
     * Cargos/títulos que alternam no efeito de máquina de escrever do hero
     * da Home (ex: "Desenvolvedor Full Stack", "Engenheiro de Software").
     * Se vazia, o frontend usa {@code headline} como único texto.
     */
    @Builder.Default
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "profile_roles", joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "display_order")
    @Column(name = "role", nullable = false, length = 80)
    private List<String> roles = new ArrayList<>();

    @Builder.Default
    @Column(name = "available_for_work", nullable = false)
    private boolean availableForWork = true;

    @Builder.Default
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Address> addresses = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void addAddress(Address address) {
        addresses.add(address);
        address.setProfile(this);
    }

    public void removeAddress(Address address) {
        addresses.remove(address);
        address.setProfile(null);
    }

    /**
     * 🚀 Métodos explícitos adicionados para contornar falhas de resolução
     * do plugin Lombok na sua IDE local.
     */
    public Long getId() {
        return this.id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
