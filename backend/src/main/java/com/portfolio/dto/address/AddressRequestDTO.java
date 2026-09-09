package com.portfolio.dto.address;

import com.portfolio.domain.enums.AddressType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Payload de entrada para criação/atualização de um endereço/contato
 * vinculado ao perfil. Utilizado exclusivamente em rotas administrativas.
 */
public record AddressRequestDTO(

        @Schema(description = "Tipo do endereço/contato", example = "RESIDENTIAL")
        @NotNull(message = "O tipo do endereço é obrigatório")
        AddressType type,

        @NotBlank(message = "A rua/logradouro é obrigatória")
        @Size(max = 200)
        String street,

        @Size(max = 20)
        String number,

        @Size(max = 100)
        String complement,

        @Size(max = 100)
        String neighborhood,

        @NotBlank(message = "A cidade é obrigatória")
        @Size(max = 100)
        String city,

        @NotBlank(message = "O estado é obrigatório")
        @Size(max = 100)
        String state,

        @NotBlank(message = "O país é obrigatório")
        @Size(max = 100)
        String country,

        @NotBlank(message = "O CEP/ZIP code é obrigatório")
        @Size(max = 20)
        String zipCode,

        @Schema(description = "Indica se este é o endereço/contato principal")
        boolean primaryAddress
) {
}
