package com.portifolio.backend.dto.contact;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.time.LocalDateTime;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ContactResponse {
    
    private Long id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private String phone;
    private String status;
    private LocalDateTime createdAt;
}

