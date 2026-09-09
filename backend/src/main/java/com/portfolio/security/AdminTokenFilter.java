package com.portfolio.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

/**
 * Filtro responsável por proteger as rotas administrativas de mutação
 * (POST, PUT, PATCH, DELETE) da API, validando o header {@code X-Admin-Token}
 * contra o valor configurado em {@code admin.token} (application.yml).
 *
 * <p>Não há tabela de usuários no banco de dados: trata-se de uma
 * autenticação simples baseada em token estático de posse exclusiva do Admin,
 * adequada ao escopo de um portfolio pessoal single-tenant.</p>
 *
 * <p>Regra geral: GET é público, POST/PUT/PATCH/DELETE exigem o token.</p>
 *
 * <p><b>Exceção deliberada — mensagens de contato</b>: {@code /api/contact-messages}
 * inverte a regra geral, porque é o único recurso onde o público
 * <i>escreve</i> (visitante enviando uma mensagem) e o Admin <i>lê</i>
 * (caixa de entrada no painel). Por isso:</p>
 * <ul>
 *   <li>{@code POST /api/contact-messages} é público (sem token) — é como o
 *       formulário de contato do site envia a mensagem.</li>
 *   <li>{@code GET /api/contact-messages} exige token — as mensagens
 *       recebidas são privadas, só o Admin deve lê-las.</li>
 * </ul>
 */
@Component
public class AdminTokenFilter extends HttpFilter {

    private static final String ADMIN_TOKEN_HEADER = "X-Admin-Token";
    private static final Set<String> PROTECTED_METHODS = Set.of("POST", "PUT", "PATCH", "DELETE");
    private static final String CONTACT_MESSAGES_PATH = "/api/contact-messages";

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${admin.token}")
    private String configuredAdminToken;

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String method = request.getMethod();
        String path = request.getRequestURI();

        boolean isContactSubmission = "POST".equals(method) && CONTACT_MESSAGES_PATH.equals(path);
        boolean isContactInboxRead = "GET".equals(method) && path.startsWith(CONTACT_MESSAGES_PATH);

        // Exceção: envio de mensagem de contato é a única escrita pública da API.
        if (isContactSubmission) {
            chain.doFilter(request, response);
            return;
        }

        // Exceção: leitura da caixa de mensagens é a única leitura administrativa.
        // Demais métodos não mutantes (GET/HEAD/OPTIONS) seguem livres.
        boolean requiresToken = isContactInboxRead || PROTECTED_METHODS.contains(method);
        if (!requiresToken) {
            chain.doFilter(request, response);
            return;
        }

        String providedToken = request.getHeader(ADMIN_TOKEN_HEADER);

        if (!StringUtils.hasText(providedToken) || !isValidToken(providedToken)) {
            writeUnauthorizedResponse(request, response);
            return;
        }

        chain.doFilter(request, response);
    }

    /** Comparação em tempo constante — evita vazar o token por diferença de latência. */
    private boolean isValidToken(String providedToken) {
        byte[] provided = providedToken.getBytes(StandardCharsets.UTF_8);
        byte[] expected = configuredAdminToken.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(provided, expected);
    }

    private void writeUnauthorizedResponse(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpStatus.UNAUTHORIZED.value());
        body.put("error", "Unauthorized");
        body.put("message", "Token administrativo ausente ou inválido. Envie o header X-Admin-Token.");
        body.put("path", request.getRequestURI());

        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
