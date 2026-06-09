package com.portifolio.backend.service.impl;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.portifolio.backend.repository.ContactRepository;
import com.portifolio.backend.service.ContactService;
import com.portifolio.backend.dto.contact.ContactRequest;
import com.portifolio.backend.dto.contact.ContactResponse;
import com.portifolio.backend.dto.contact.ContactStatusRequest;
import com.portifolio.backend.dto.contact.MessageResponse;
import com.portifolio.backend.mapper.ContactMapper;
import com.portifolio.backend.model.Contact;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepo;

    @Autowired
    private ContactMapper contactMapper;

    @Value("${app.admin.secret-key:portfolio-admin-key-2026}")
    private String adminSecretKey;

    private void checkAdminKey(String key) {
        if (key == null || !key.equals(adminSecretKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrative access denied. Invalid key.");
        }
    }

    @Override
    public MessageResponse sendContact(ContactRequest req, String ipAddress) {
        Contact contact = Contact.builder()
                .name(req.getName())
                .email(req.getEmail())
                .subject(req.getSubject())
                .message(req.getMessage())
                .phone(req.getPhone())
                .ipAddress(ipAddress)
                .status("new")
                .build();
                
        contactRepo.save(contact);
        
        return MessageResponse.builder()
                .message("Mensagem enviada com sucesso! Entrarei em contato em breve.")
                .build();
    }

    @Override
    public List<ContactResponse> listContactsAdmin(String key, String status) {
        checkAdminKey(key);
        List<Contact> contacts = (status != null)
                ? contactRepo.findByStatusOrderByCreatedAtDesc(status)
                : contactRepo.findAllByOrderByCreatedAtDesc();
                
        return contacts.stream().map(contactMapper::toResponse).toList();
    }

    @Override
    public ContactResponse updateContactStatusAdmin(String key, Long id, ContactStatusRequest req) {
        checkAdminKey(key);
        Contact c = contactRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact message not found."));
                
        c.setStatus(req.getStatus());
        return contactMapper.toResponse(contactRepo.save(c));
    }

    @Override
    public Map<String, Long> countNewContactsAdmin(String key) {
        checkAdminKey(key);
        return Map.of("count", contactRepo.countByStatus("new"));
    }
}
