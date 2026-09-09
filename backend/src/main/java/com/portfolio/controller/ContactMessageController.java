package com.portfolio.controller;

import com.portfolio.dto.contact.ContactMessageRequestDTO;
import com.portfolio.dto.contact.ContactMessageResponseDTO;
import com.portfolio.dto.contact.ContactMessageStatusUpdateDTO;
import com.portfolio.service.ContactMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Mensagens do formulário de contato público.
 *
 * <p><b>Único recurso da API com a regra de segurança invertida</b>:
 * {@code POST} (envio pelo visitante) é público; {@code GET}
 * (leitura da caixa de entrada pelo Admin) exige {@code X-Admin-Token}.
 * Ver {@link com.portfolio.backend.security.AdminTokenFilter}.</p>
 *
 * <p>O envio público também é protegido por rate limiting por IP —
 * ver {@link com.portfolio.backend.ratelimit.ContactRateLimiter}.</p>
 */
@RestController
@RequestMapping("/api/contact-messages")
@Tag(name = "Contact Messages", description = "Formulário de contato — envio público, leitura administrativa")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @PostMapping
    @Operation(
            summary = "Enviar mensagem de contato",
            description = "Rota PÚBLICA — usada pelo formulário de contato do site. "
                    + "Limitada a 5 envios por IP a cada 30 minutos. Inclui campo honeypot "
                    + "(`website`) anti-spam: se preenchido, a mensagem é descartada silenciosamente."
    )
    @ApiResponse(responseCode = "201", description = "Mensagem recebida com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @ApiResponse(responseCode = "429", description = "Limite de envios excedido para este IP")
    public ResponseEntity<ContactMessageResponseDTO> submit(@Valid @RequestBody ContactMessageRequestDTO requestDTO,
                                                            HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contactMessageService.submit(requestDTO, resolveClientIp(request)));
    }

    @GetMapping
    @Operation(
            summary = "Listar mensagens recebidas (Admin)",
            description = "Única rota GET da API que exige X-Admin-Token — as mensagens são privadas.",
            security = @SecurityRequirement(name = "X-Admin-Token")
    )
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @ApiResponse(responseCode = "401", description = "Token administrativo ausente ou inválido")
    public ResponseEntity<List<ContactMessageResponseDTO>> listMessages() {
        return ResponseEntity.ok(contactMessageService.listMessages());
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Contagem de mensagens novas (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "200", description = "Contagem retornada com sucesso")
    public ResponseEntity<Map<String, Long>> countUnread() {
        return ResponseEntity.ok(Map.of("unread", contactMessageService.countUnread()));
    }

    @PatchMapping("/{id}/status")
    @Operation(
            summary = "Atualizar status da mensagem (Admin)",
            description = "Workflow: NEW → READ → REPLIED, ou ARCHIVED a qualquer momento.",
            security = @SecurityRequirement(name = "X-Admin-Token")
    )
    @ApiResponse(responseCode = "200", description = "Status atualizado com sucesso")
    @ApiResponse(responseCode = "404", description = "Mensagem não encontrada")
    public ResponseEntity<ContactMessageResponseDTO> updateStatus(
            @Parameter(description = "ID da mensagem") @PathVariable Long id,
            @Valid @RequestBody ContactMessageStatusUpdateDTO statusUpdateDTO) {
        return ResponseEntity.ok(contactMessageService.updateStatus(id, statusUpdateDTO.status()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover mensagem (Admin)", security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "204", description = "Mensagem removida com sucesso")
    @ApiResponse(responseCode = "404", description = "Mensagem não encontrada")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        contactMessageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }

    /** Considera X-Forwarded-For (proxy/load balancer) antes do IP direto da conexão. */
    private String resolveClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwardedFor)) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
