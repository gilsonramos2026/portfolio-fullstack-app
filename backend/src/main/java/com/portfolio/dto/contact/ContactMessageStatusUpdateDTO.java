package com.portfolio.dto.contact;

import com.portfolio.domain.enums.ContactMessageStatus;
import jakarta.validation.constraints.NotNull;

public record ContactMessageStatusUpdateDTO(
        @NotNull(message = "O status é obrigatório")
        ContactMessageStatus status
) {
}
