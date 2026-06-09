package com.portifolio.backend.controller;

import java.util.List;
import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.portifolio.backend.dto.contact.ContactRequest;
import com.portifolio.backend.dto.contact.ContactResponse;
import com.portifolio.backend.dto.contact.ContactStatusRequest;
import com.portifolio.backend.dto.contact.MessageResponse;
import com.portifolio.backend.service.ContactService;

@RestController
@RequestMapping("/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    // ============================================================================
    // FEED PÚBLICO - Enviar Mensagem
    // ============================================================================
    @Tag(name = "Público - Contato")
    @Operation(summary = "Enviar mensagem de contato")
    @ApiResponse(responseCode = "201", description = "Mensagem enviada")
    @PostMapping
    public ResponseEntity<MessageResponse> sendContact(
            @Valid @RequestBody ContactRequest req, HttpServletRequest httpReq) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contactService.sendContact(req, httpReq.getRemoteAddr()));
    }

    // ============================================================================
    // OPERAÇÕES ADMINISTRATIVAS (Protegidas)
    // ============================================================================
    @Tag(name = "Admin - Contatos")
    @Operation(summary = "Listar contatos recebidos")
    @GetMapping
    public ResponseEntity<List<ContactResponse>> listContacts(
            @RequestHeader("X-Admin-Key") String key,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(contactService.listContactsAdmin(key, status));
    }

    @Tag(name = "Admin - Contatos")
    @Operation(summary = "Atualizar status de um contato")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ContactResponse> updateContactStatus(
            @RequestHeader("X-Admin-Key") String key,
            @PathVariable Long id,
            @Valid @RequestBody ContactStatusRequest req) {
        return ResponseEntity.ok(contactService.updateContactStatusAdmin(key, id, req));
    }

    @Tag(name = "Admin - Contatos")
    @Operation(summary = "Contar mensagens novas")
    @GetMapping("/count-new")
    public ResponseEntity<Map<String, Long>> countNewContacts(@RequestHeader("X-Admin-Key") String key) {
        return ResponseEntity.ok(contactService.countNewContactsAdmin(key));
    }
}
