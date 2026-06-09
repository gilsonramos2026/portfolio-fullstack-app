package com.portifolio.backend.service;

import java.util.List;
import java.util.Map;
import com.portifolio.backend.dto.contact.ContactRequest;
import com.portifolio.backend.dto.contact.ContactResponse;
import com.portifolio.backend.dto.contact.ContactStatusRequest;
import com.portifolio.backend.dto.contact.MessageResponse;

public interface ContactService {
    MessageResponse sendContact(ContactRequest req, String ipAddress);
    List<ContactResponse> listContactsAdmin(String key, String status);
    ContactResponse updateContactStatusAdmin(String key, Long id, ContactStatusRequest req);
    Map<String, Long> countNewContactsAdmin(String key);
}

