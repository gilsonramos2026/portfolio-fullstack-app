package com.portfolio.service;

import com.portfolio.domain.Project;
import com.portfolio.domain.enums.ProjectStatus;
import com.portfolio.dto.project.ProjectRequestDTO;
import com.portfolio.dto.project.ProjectResponseDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.ProjectMapper;
import com.portfolio.repository.ProjectRepository;
import com.portfolio.service.impl.ProjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Suíte de testes unitários do {@link ProjectServiceImpl}, isolando a
 * camada de serviço com mocks de {@link ProjectRepository} e
 * {@link ProjectMapper} (JUnit 5 + Mockito).
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ProjectServiceImpl")
class ProjectServiceImplTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectMapper projectMapper;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private Project project;
    private ProjectRequestDTO requestDTO;
    private ProjectResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        project = Project.builder()
                .id(1L)
                .title("API de Portfolio")
                .shortDescription("API REST para gestão de portfolio")
                .status(ProjectStatus.COMPLETED)
                .featured(true)
                .displayOrder(1)
                .techStack(List.of("Java", "Spring Boot", "PostgreSQL"))
                .build();

        requestDTO = new ProjectRequestDTO(
                "API de Portfolio",
                "API REST para gestão de portfolio",
                "Descrição completa do projeto",
                "https://github.com",
                "https://exemplo.com",
                "https://exemplo.com",
                ProjectStatus.COMPLETED,
                true,
                1,
                LocalDate.of(2024, 1, 1),
                LocalDate.of(2024, 3, 1),
                List.of("Java", "Spring Boot", "PostgreSQL"));

        responseDTO = new ProjectResponseDTO(
                1L,
                "API de Portfolio",
                "API REST para gestão de portfolio",
                "Descrição completa do projeto",
                "https://github.com",
                "https://exemplo.com",
                "https://exemplo.com",
                ProjectStatus.COMPLETED,
                true,
                1,
                LocalDate.of(2024, 1, 1),
                LocalDate.of(2024, 3, 1),
                List.of("Java", "Spring Boot", "PostgreSQL"),
                null,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Nested
    @DisplayName("listProjects")
    class ListProjects {

        @Test
        @DisplayName("deve retornar uma página de projetos mapeados para DTO")
        void shouldReturnPagedProjects() {
            Pageable pageable = PageRequest.of(0, 10);
            Page<Project> projectPage = new PageImpl<>(List.of(project), pageable, 1);

            when(projectRepository.findAll(pageable)).thenReturn(projectPage);
            when(projectMapper.toResponseDTO(project)).thenReturn(responseDTO);

            Page<ProjectResponseDTO> result = projectService.listProjects(pageable);

            assertThat(result.getTotalElements()).isEqualTo(1);
            assertThat(result.getContent().get(0).title()).isEqualTo("API de Portfolio");
            verify(projectRepository).findAll(pageable);
        }

        @Test
        @DisplayName("deve retornar página vazia quando não há projetos cadastrados")
        void shouldReturnEmptyPageWhenNoProjects() {
            Pageable pageable = PageRequest.of(0, 10);
            when(projectRepository.findAll(pageable)).thenReturn(Page.empty(pageable));

            Page<ProjectResponseDTO> result = projectService.listProjects(pageable);

            assertThat(result.getContent()).isEmpty();
            verifyNoInteractions(projectMapper);
        }
    }

    @Nested
    @DisplayName("listFeaturedProjects")
    class ListFeaturedProjects {

        @Test
        @DisplayName("deve delegar ao repositório o filtro de projetos em destaque")
        void shouldReturnOnlyFeaturedProjects() {
            Pageable pageable = PageRequest.of(0, 5);
            Page<Project> featuredPage = new PageImpl<>(List.of(project), pageable, 1);

            when(projectRepository.findByFeaturedTrue(pageable)).thenReturn(featuredPage);
            when(projectMapper.toResponseDTO(project)).thenReturn(responseDTO);

            Page<ProjectResponseDTO> result = projectService.listFeaturedProjects(pageable);

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).featured()).isTrue();
            verify(projectRepository).findByFeaturedTrue(pageable);
        }
    }

    @Nested
    @DisplayName("getProjectById")
    class GetProjectById {

        @Test
        @DisplayName("deve retornar o projeto quando o ID existe")
        void shouldReturnProjectWhenIdExists() {
            when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
            when(projectMapper.toResponseDTO(project)).thenReturn(responseDTO);

            ProjectResponseDTO result = projectService.getProjectById(1L);

            assertThat(result.id()).isEqualTo(1L);
            assertThat(result.title()).isEqualTo("API de Portfolio");
        }

        @Test
        @DisplayName("deve lançar ResourceNotFoundException quando o ID não existe")
        void shouldThrowExceptionWhenIdDoesNotExist() {
            when(projectRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> projectService.getProjectById(99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");

            verifyNoInteractions(projectMapper);
        }
    }

    @Nested
    @DisplayName("createProject")
    class CreateProject {

        @Test
        @DisplayName("deve mapear o DTO, persistir e retornar o projeto criado")
        void shouldCreateProjectSuccessfully() {
            when(projectMapper.toEntity(requestDTO)).thenReturn(project);
            when(projectRepository.save(project)).thenReturn(project);
            when(projectMapper.toResponseDTO(project)).thenReturn(responseDTO);

            ProjectResponseDTO result = projectService.createProject(requestDTO);

            assertThat(result).isEqualTo(responseDTO);
            verify(projectMapper).toEntity(requestDTO);
            verify(projectRepository).save(project);
        }
    }

    @Nested
    @DisplayName("updateProject")
    class UpdateProject {

        @Test
        @DisplayName("deve atualizar um projeto existente")
        void shouldUpdateExistingProject() {
            when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
            when(projectRepository.save(project)).thenReturn(project);
            when(projectMapper.toResponseDTO(project)).thenReturn(responseDTO);

            ProjectResponseDTO result = projectService.updateProject(1L, requestDTO);

            assertThat(result).isEqualTo(responseDTO);
            verify(projectMapper).updateEntityFromDto(requestDTO, project);
            verify(projectRepository).save(project);
        }

        @Test
        @DisplayName("deve lançar ResourceNotFoundException ao atualizar projeto inexistente")
        void shouldThrowExceptionWhenUpdatingNonExistentProject() {
            when(projectRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> projectService.updateProject(99L, requestDTO))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");

            verify(projectRepository, never()).save(any(Project.class));
            verify(projectMapper, never()).updateEntityFromDto(any(), any());
        }
    }

    @Nested
    @DisplayName("deleteProject")
    class DeleteProject {

        @Test
        @DisplayName("deve remover o projeto com sucesso quando o ID existir")
        void shouldDeleteProjectSuccessfully() {
            when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
            doNothing().when(projectRepository).delete(project);

            projectService.deleteProject(1L);

            verify(projectRepository).findById(1L);
            verify(projectRepository).delete(project);
        }

        @Test
        @DisplayName("deve lançar ResourceNotFoundException ao tentar deletar projeto inexistente")
        void shouldThrowExceptionWhenDeletingNonExistentProject() {
            when(projectRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> projectService.deleteProject(99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");

            verify(projectRepository, never()).delete(any(Project.class));
        }
    }
}
