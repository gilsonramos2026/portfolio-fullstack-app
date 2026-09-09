package com.portfolio.service;
import com.portfolio.dto.project.ProjectImageResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectImageService {

    ProjectImageResponseDTO addImage(Long projectId, MultipartFile file);

    void deleteImage(Long projectId, Long imageId);

    List<ProjectImageResponseDTO> reorderImages(Long projectId, List<Long> orderedImageIds);
}
