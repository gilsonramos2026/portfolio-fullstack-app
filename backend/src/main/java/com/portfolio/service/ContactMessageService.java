package com.portfolio.service;

import com.portfolio.domain.enums.ContactMessageStatus;
import com.portfolio.dto.contact.ContactMessageRequestDTO;
import com.portfolio.dto.contact.ContactMessageResponseDTO;

import java.util.List;

public interface ContactMessageService {

    /**
     * Recebe uma submissão do formulário público. Se o honeypot vier
     * preenchido, a mensagem é descartada silenciosamente (retorno vazio),
     * sem persistir nem lançar erro — para não revelar ao bot que foi
     * detectado.
     */
    ContactMessageResponseDTO submit(ContactMessageRequestDTO requestDTO, String clientIp);

    List<ContactMessageResponseDTO> listMessages();

    /** Contagem de mensagens com status NEW — precisam de atenção do Admin. */
    long countUnread();

    ContactMessageResponseDTO updateStatus(Long id, ContactMessageStatus status);

    void deleteMessage(Long id);
}
