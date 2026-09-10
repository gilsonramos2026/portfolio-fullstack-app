package com.portfolio.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.domain.enums.ProjectStatus;
import com.portfolio.dto.project.ProjectRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Teste de integração ponta-a-ponta do fluxo de projetos, subindo um
 * PostgreSQL real via Testcontainers e validando:
 * <ul>
 *   <li>leitura pública (GET) sem token;</li>
 *   <li>bloqueio de mutação (POST) sem o header X-Admin-Token;</li>
 *   <li>criação bem-sucedida com o token administrativo correto.</li>
 * </ul>
 */
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
class ProjectControllerIntegrationTest {

    private static final String ADMIN_TOKEN = "test-admin-token";

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("portfolio_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("admin.token", () -> ADMIN_TOKEN);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldAllowPublicReadOfProjects() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldRejectProjectCreationWithoutAdminToken() throws Exception {
        ProjectRequestDTO dto = sampleProjectDto();

        mockMvc.perform(post("/api/projects")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldCreateProjectWithValidAdminToken() throws Exception {
        ProjectRequestDTO dto = sampleProjectDto();

        mockMvc.perform(post("/api/projects")
                        .header("X-Admin-Token", ADMIN_TOKEN)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value(dto.title()));
    }

    private ProjectRequestDTO sampleProjectDto() {
        return new ProjectRequestDTO(
                "Projeto de Integração",
                "Descrição curta de teste",
                "Descrição completa de teste",
                "https://github.com/exemplo/repo",
                "https://demo.exemplo.com",
                "https://exemplo.com/img.png",
                ProjectStatus.COMPLETED,
                false,
                0,
                LocalDate.now(),
                LocalDate.now(),
                List.of("Java", "Spring Boot"));
    }
}
