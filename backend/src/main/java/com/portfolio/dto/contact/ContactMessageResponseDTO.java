package com.portfolio.dto.contact;

import com.portfolio.backend.domain.ContactMessageStatus;

import java.time.LocalDateTime;

public record ContactMessageResponseDTO(
        Long id,
        String name,
        String email,
        String message,
        ContactMessageStatus status,
        LocalDateTime createdAt
) {
}
