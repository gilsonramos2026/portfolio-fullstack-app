package com.portifolio.backend.mapper;

import org.springframework.stereotype.Component;
import com.portifolio.backend.dto.contact.ContactResponse;
import com.portifolio.backend.model.Contact;

@Component
public class ContactMapper {

    public ContactResponse toResponse(Contact c) {
        if (c == null) return null;
        return ContactResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .email(c.getEmail())
                .subject(c.getSubject())
                .message(c.getMessage())
                .phone(c.getPhone())
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .build();
    }
}

