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

@Component
public class AdminTokenFilter extends HttpFilter {

    private static final String ADMIN_TOKEN_HEADER = "X-Admin-Token";
    private static final Set<String> PROTECTED_METHODS = Set.of("POST", "PUT", "PATCH", "DELETE");
    private static final String CONTACT_MESSAGES_PATH = "/api/contact-messages";
    private static final String ADMIN_SESSION_VALIDATE_PATH = "/api/admin/session/validate";

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${portfolio.admin.token:${ADMIN_TOKEN:meu-token-seguro-123}}")
    private String configuredAdminToken;

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // Se for OPTIONS, apenas passa adiante sem barrar
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String method = request.getMethod();
        String path = request.getRequestURI();

        if (!path.startsWith("/api")) {
            chain.doFilter(request, response);
            return;
        }

        boolean isContactSubmission = "POST".equals(method) && CONTACT_MESSAGES_PATH.equals(path);
        boolean isContactInboxRead = "GET".equals(method) && path.startsWith(CONTACT_MESSAGES_PATH);
        boolean isAdminSessionValidate = path.equals(ADMIN_SESSION_VALIDATE_PATH);

        if (isContactSubmission) {
            chain.doFilter(request, response);
            return;
        }

        boolean requiresToken = isAdminSessionValidate || isContactInboxRead || PROTECTED_METHODS.contains(method);
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
        body.put("message", "Token administrativo ausente ou inválido. Envie o header X-Admin-Token correto.");
        body.put("path", request.getRequestURI());

        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
