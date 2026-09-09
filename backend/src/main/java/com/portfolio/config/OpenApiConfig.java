package com.portfolio.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração central do SpringDoc OpenAPI 3 (Swagger UI).
 *
 * <p>Declara o esquema de segurança do header {@code X-Admin-Token},
 * utilizado nas rotas administrativas de mutação, para que o Swagger UI
 * exiba o botão "Authorize" e permita testar os endpoints protegidos.</p>
 */
@Configuration
public class OpenApiConfig {

    private static final String ADMIN_TOKEN_SCHEME = "X-Admin-Token";

    @Bean
    public OpenAPI portfolioOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Portfolio Profissional Full-Stack API")
                        .description("API centralizada para gestão de perfil, endereços/contatos e projetos "
                                + "de um portfolio profissional. Rotas GET são públicas; rotas de mutação "
                                + "exigem o header X-Admin-Token.")
                        .version("v1.0.0")
                        .contact(new Contact().name("Admin").email("seuemail@exemplo.com"))
                        .license(new License().name("MIT")))
                .components(new Components()
                        .addSecuritySchemes(ADMIN_TOKEN_SCHEME, new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.HEADER)
                                .name("X-Admin-Token")
                                .description("Token administrativo estático configurado em application.yml")));
    }
}
