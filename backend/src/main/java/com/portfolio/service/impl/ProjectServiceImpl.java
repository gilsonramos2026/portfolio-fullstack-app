package com.portfolio.service.impl;

import com.portfolio.backend.domain.Project;
import com.portfolio.backend.dto.project.ProjectRequestDTO;
import com.portfolio.backend.dto.project.ProjectResponseDTO;
import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.mapper.ProjectMapper;
import com.portfolio.backend.repository.ProjectRepository;
import com.portfolio.backend.service.ProjectService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementação das regras de negócio do CRUD completo de projetos.
 *
 * <p>Leituras (listagem paginada, listagem de destaques e busca por id)
 * são somente-leitura; mutações (criar, atualizar, excluir) são
 * transacionais e reservadas às rotas administrativas protegidas pelo
 * {@code AdminTokenFilter}.</p>
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    public Page<ProjectResponseDTO> listProjects(Pageable pageable) {
        return projectRepository.findAll(pageable)
                .map(projectMapper::toResponseDTO);
    }

    @Override
    public Page<ProjectResponseDTO> listFeaturedProjects(Pageable pageable) {
        return projectRepository.findByFeaturedTrue(pageable)
                .map(projectMapper::toResponseDTO);
    }

    @Override
    public ProjectResponseDTO getProjectById(Long id) {
        Project project = findProjectOrThrow(id);
        return projectMapper.toResponseDTO(project);
    }

    @Override
    @Transactional
    public ProjectResponseDTO createProject(ProjectRequestDTO requestDTO) {
        Project project = projectMapper.toEntity(requestDTO);
        Project saved = projectRepository.save(project);
        log.info("Projeto criado pelo Admin (id={}, title={})", saved.getId(), saved.getTitle());
        return projectMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public ProjectResponseDTO updateProject(Long id, ProjectRequestDTO requestDTO) {
        Project project = findProjectOrThrow(id);
        projectMapper.updateEntityFromDto(requestDTO, project);
        Project saved = projectRepository.save(project);
        log.info("Projeto atualizado pelo Admin (id={})", saved.getId());
        return projectMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        Project project = findProjectOrThrow(id);
        projectRepository.delete(project);
        log.info("Projeto removido pelo Admin (id={})", id);
    }

    private Project findProjectOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("Projeto", id));
    }
}
