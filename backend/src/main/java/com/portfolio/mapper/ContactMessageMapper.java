package com.portfolio.mapper;

import com.portfolio.domain.ContactMessage;
import com.portfolio.domain.enums.ContactMessageStatus;
import com.portfolio.dto.contact.ContactMessageRequestDTO;
import com.portfolio.dto.contact.ContactMessageResponseDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ContactMessageMapper {

    public ContactMessage toEntity(ContactMessageRequestDTO dto) {
        return ContactMessage.builder()
                .name(dto.name())
                .email(dto.email())
                .message(dto.message())
                .status(ContactMessageStatus.NEW)
                .build();
    }

    public ContactMessageResponseDTO toResponseDTO(ContactMessage entity) {
        return new ContactMessageResponseDTO(
                entity.getId(), entity.getName(), entity.getEmail(),
                entity.getMessage(), entity.getStatus(), entity.getCreatedAt());
    }

    public List<ContactMessageResponseDTO> toResponseDTOList(List<ContactMessage> items) {
        return items.stream().map(this::toResponseDTO).toList();
    }
}
