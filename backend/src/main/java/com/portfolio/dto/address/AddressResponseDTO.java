package com.portfolio.dto.address;

import com.portfolio.domain.enums.AddressType;

import java.time.LocalDateTime;

/**
 * Representação pública de um endereço/contato.
 */
public record AddressResponseDTO(
        Long id,
        AddressType type,
        String street,
        String number,
        String complement,
        String neighborhood,
        String city,
        String state,
        String country,
        String zipCode,
        boolean primaryAddress,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
