package com.portfolio.service.impl;

import com.portfolio.domain.Project;
import com.portfolio.domain.ProjectImage;
import com.portfolio.domain.enums.UploadKind;
import com.portfolio.dto.project.ProjectImageResponseDTO;
import com.portfolio.exception.BusinessException;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ProjectImageRepository;
import com.portfolio.repository.ProjectRepository;
import com.portfolio.service.FileStorageService;
import com.portfolio.service.ProjectImageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class ProjectImageServiceImpl implements ProjectImageService {

    private final ProjectRepository projectRepository;
    private final ProjectImageRepository projectImageRepository;
    private final FileStorageService fileStorageService;

    public ProjectImageServiceImpl(ProjectRepository projectRepository,
                                    ProjectImageRepository projectImageRepository,
                                    FileStorageService fileStorageService) {
        this.projectRepository = projectRepository;
        this.projectImageRepository = projectImageRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public ProjectImageResponseDTO addImage(Long projectId, MultipartFile file) {
        Project project = findProjectOrThrow(projectId);

        String url = fileStorageService.store(file, UploadKind.IMAGE);
        int nextOrder = project.getImages().size();

        ProjectImage image = ProjectImage.builder()
                .project(project)
                .url(url)
                .displayOrder(nextOrder)
                .build();

        ProjectImage saved = projectImageRepository.save(image);
        log.info("Imagem adicionada ao projeto {} (imageId={})", projectId, saved.getId());
        return new ProjectImageResponseDTO(saved.getId(), saved.getUrl(), saved.getDisplayOrder());
    }

    @Override
    public void deleteImage(Long projectId, Long imageId) {
        ProjectImage image = projectImageRepository.findByIdAndProjectId(imageId, projectId)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("Imagem do projeto", imageId));
        projectImageRepository.delete(image);
        log.info("Imagem removida do projeto {} (imageId={})", projectId, imageId);
    }

    @Override
    public List<ProjectImageResponseDTO> reorderImages(Long projectId, List<Long> orderedImageIds) {
        Project project = findProjectOrThrow(projectId);

        Map<Long, ProjectImage> byId = project.getImages().stream()
                .collect(Collectors.toMap(ProjectImage::getId, img -> img));

        if (!byId.keySet().equals(new java.util.HashSet<>(orderedImageIds))) {
            throw new BusinessException("A lista de reordenação deve conter exatamente as imagens atuais do projeto.");
        }

        for (int i = 0; i < orderedImageIds.size(); i++) {
            byId.get(orderedImageIds.get(i)).setDisplayOrder(i);
        }

        return project.getImages().stream()
                .sorted(java.util.Comparator.comparingInt(ProjectImage::getDisplayOrder))
                .map(img -> new ProjectImageResponseDTO(img.getId(), img.getUrl(), img.getDisplayOrder()))
                .toList();
    }

    private Project findProjectOrThrow(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("Projeto", projectId));
    }
}
