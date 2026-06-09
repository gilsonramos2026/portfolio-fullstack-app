package com.portifolio.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class Contact {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100) 
    private String name;
    
    @Column(nullable = false, length = 150) 
    private String email;
    
    @Column(length = 200) 
    private String subject;
    
    @Column(nullable = false, columnDefinition = "TEXT") 
    private String message;
    
    @Column(length = 30) 
    private String phone;
    
    @Builder.Default // Garante que o Lombok @Builder respeite o valor padrão "new"
    @Column(length = 30, nullable = false) 
    private String status = "new";
    
    @Column(name = "ip_address", length = 50) 
    private String ipAddress;
    
    @Column(name = "created_at", updatable = false) // Protege a data de registro original
    private LocalDateTime createdAt;
    
    @PrePersist 
    protected void onCreate() { 
        createdAt = LocalDateTime.now(); 
    }
}

