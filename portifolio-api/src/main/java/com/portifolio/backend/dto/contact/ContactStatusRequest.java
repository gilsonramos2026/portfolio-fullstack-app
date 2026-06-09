package com.portifolio.backend.dto.contact;

import jakarta.validation.constraints.*;
import lombok.*;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class ContactStatusRequest {

    @NotBlank 
    @Pattern(regexp = "new|read|replied|archived", message = "Status deve ser: new, read, replied ou archived") 
    private String status;
}

