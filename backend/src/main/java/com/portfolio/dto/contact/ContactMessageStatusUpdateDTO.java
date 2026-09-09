package com.portfolio.dto.contact;

import com.portfolio.backend.domain.ContactMessageStatus;
import jakarta.validation.constraints.NotNull;

public record ContactMessageStatusUpdateDTO(
        @NotNull(message = "O status é obrigatório")
        ContactMessageStatus status
) {
}
