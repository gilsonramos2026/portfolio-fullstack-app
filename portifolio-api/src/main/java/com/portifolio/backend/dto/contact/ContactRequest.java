package com.portifolio.backend.dto.contact;

import jakarta.validation.constraints.*;
import lombok.*;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class ContactRequest {

    @NotBlank 
    @Size(max = 100) 
    private String name;

    @NotBlank 
    @Email 
    @Size(max = 150) 
    private String email;

    @Size(max = 200) 
    private String subject;

    @NotBlank 
    @Size(min = 10, max = 5000) 
    private String message;

    @Size(max = 30) 
    private String phone;
}

