package com.portfolio.service.impl;

import com.portfolio.domain.ContactMessage;
import com.portfolio.domain.enums.ContactMessageStatus;
import com.portfolio.dto.contact.ContactMessageRequestDTO;
import com.portfolio.dto.contact.ContactMessageResponseDTO;
import com.portfolio.mapper.ContactMessageMapper;
import com.portfolio.repository.ContactMessageRepository;
import com.portfolio.service.ContactMessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Slf4j
@Service
@Transactional(readOnly = true)
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final ContactMessageMapper contactMessageMapper;
    private final ContactRateLimiter contactRateLimiter;

    public ContactMessageServiceImpl(ContactMessageRepository contactMessageRepository,
                                     ContactMessageMapper contactMessageMapper,
                                     ContactRateLimiter contactRateLimiter) {
        this.contactMessageRepository = contactMessageRepository;
        this.contactMessageMapper = contactMessageMapper;
        this.contactRateLimiter = contactRateLimiter;
    }

    @Override
    @Transactional
    public ContactMessageResponseDTO submit(ContactMessageRequestDTO requestDTO, String clientIp) {
        if (StringUtils.hasText(requestDTO.website())) {
            // Honeypot preenchido: quase certamente um bot. Descarta sem
            // persistir e sem avisar o remetente — resposta idêntica à de
            // sucesso, para não revelar a detecção. Não passa pelo rate
            // limiter: um bot martelando o honeypot não deve conseguir
            // esgotar a cota de IPs legítimos por trás do mesmo NAT.
            log.warn("Submissão de contato descartada por honeypot (spam suspeito)");
            return new ContactMessageResponseDTO(null, requestDTO.name(), requestDTO.email(),
                    requestDTO.message(), ContactMessageStatus.NEW, null);
        }

        if (!contactRateLimiter.tryAcquire(clientIp)) {
            throw new RateLimitExceededException(
                    "Muitas mensagens enviadas recentemente. Tente novamente em alguns minutos.");
        }

        ContactMessage saved = contactMessageRepository.save(contactMessageMapper.toEntity(requestDTO));
        log.info("Nova mensagem de contato recebida (id={})", saved.getId());
        return contactMessageMapper.toResponseDTO(saved);
    }

    @Override
    public List<ContactMessageResponseDTO> listMessages() {
        return contactMessageMapper.toResponseDTOList(contactMessageRepository.findAllByOrderByCreatedAtDesc());
    }

    @Override
    public long countUnread() {
        return contactMessageRepository.countByStatus(ContactMessageStatus.NEW);
    }

    @Override
    @Transactional
    public ContactMessageResponseDTO updateStatus(Long id, ContactMessageStatus status) {
        ContactMessage message = findOrThrow(id);
        message.setStatus(status);
        return contactMessageMapper.toResponseDTO(contactMessageRepository.save(message));
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        ContactMessage message = findOrThrow(id);
        contactMessageRepository.delete(message);
        log.info("Mensagem de contato removida pelo Admin (id={})", id);
    }

    private ContactMessage findOrThrow(Long id) {
        return contactMessageRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("Mensagem de contato", id));
    }
}
