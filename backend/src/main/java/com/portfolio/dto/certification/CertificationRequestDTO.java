package com.portfolio.dto.certification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CertificationRequestDTO(

        @NotBlank(message = "O nome da certificação é obrigatório")
        @Size(max = 150)
        String name,

        @NotBlank(message = "O emissor é obrigatório")
        @Size(max = 150)
        String issuer,

        @NotNull(message = "A data de emissão é obrigatória")
        LocalDate issueDate,

        /** Nulo = não expira. */
        LocalDate expirationDate,

        @Size(max = 500)
        String credentialUrl,

        @Size(max = 500)
        String imageUrl,

        int displayOrder
) {
}
