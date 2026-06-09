package com.portifolio.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI portfolioOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Portfolio API")
                        .description("""
                                ## API do Portfólio Profissional
                                
                                Endpoints divididos em dois grupos:
                                - **Público** – sem autenticação, para o site do portfólio
                                - **Admin** – protegido por chave secreta no header `X-Admin-Key`
                                
                                ### Como usar o Admin
                                Passe o header `X-Admin-Key: <seu-secret>` nas requisições admin.
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                // CORREÇÃO: Atualizado com os seus dados reais de desenvolvedor
                                .name("Gilson Ramos")
                                .email("gilsonramos@example.com")
                                .url("https://github.com"))
                        .license(new License().name("MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080/api").description("Ambiente Local"),
                        new Server().url("https://api.seudominio.com/api").description("Ambiente de Produção")
                ))
                .tags(List.of(
                        new Tag().name("Público - Perfil").description("Dados do perfil público"),
                        new Tag().name("Público - Projetos").description("Listagem e detalhes de projetos"),
                        new Tag().name("Público - Skills").description("Habilidades técnicas"),
                        new Tag().name("Público - Experiências").description("Histórico profissional"),
                        new Tag().name("Público - Educação").description("Formação acadêmica"),
                        new Tag().name("Público - Certificações").description("Certificados e cursos"),
                        new Tag().name("Público - Testemunhos").description("Depoimentos"),
                        new Tag().name("Público - Contato").description("Formulário de contato"),
                        new Tag().name("Admin - Perfil").description("Gerenciamento do perfil"),
                        new Tag().name("Admin - Projetos").description("CRUD de projetos"),
                        new Tag().name("Admin - Skills").description("CRUD de habilidades"),
                        new Tag().name("Admin - Experiências").description("CRUD de experiências"),
                        new Tag().name("Admin - Educação").description("CRUD de educação"),
                        new Tag().name("Admin - Certificações").description("CRUD de certificações"),
                        new Tag().name("Admin - Testemunhos").description("CRUD de testemunhos"),
                        new Tag().name("Admin - Contatos").description("Gerenciamento de contatos recebidos")
                ));
    }
}
