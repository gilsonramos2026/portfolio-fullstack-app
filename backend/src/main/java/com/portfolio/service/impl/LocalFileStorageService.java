package com.portfolio.service.impl;

import com.portfolio.domain.enums.UploadKind;
import com.portfolio.exception.FileStorageException;
import com.portfolio.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.UUID;

/**
 * Implementação de {@link FileStorageService} que persiste os arquivos em
 * um diretório local ({@code app.upload.dir}), organizados em subpastas por
 * categoria ({@code images/}, {@code documents/}). As URLs retornadas
 * apontam para {@code app.upload.public-base-url}, servido estaticamente
 * pelo {@code WebConfig} em {@code /uploads/**}.
 */
@Slf4j
@Service
public class LocalFileStorageService implements FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.upload.public-base-url}")
    private String publicBaseUrl;

    @Value("${app.upload.max-image-size-mb}")
    private long maxImageSizeMb;

    @Value("${app.upload.max-document-size-mb}")
    private long maxDocumentSizeMb;

    @Override
    public String store(MultipartFile file, UploadKind kind) {
        validate(file, kind);

        String extension = extractExtension(file.getOriginalFilename());
        String storedFileName = UUID.randomUUID() + "." + extension;

        Path targetDir = Path.of(uploadDir, kind.getSubFolder()).toAbsolutePath().normalize();
        Path targetFile = targetDir.resolve(storedFileName);

        try {
            Files.createDirectories(targetDir);
            file.transferTo(targetFile);
        } catch (IOException ex) {
            log.error("Falha ao gravar arquivo enviado em {}", targetFile, ex);
            throw new FileStorageException("Não foi possível salvar o arquivo enviado. Tente novamente.", ex);
        }

        log.info("Arquivo armazenado: {} ({} bytes)", targetFile, file.getSize());
        return publicBaseUrl + "/" + kind.getSubFolder() + "/" + storedFileName;
    }

    private void validate(MultipartFile file, UploadKind kind) {
        if (file == null || file.isEmpty()) {
            throw new FileStorageException("Envie um arquivo válido.");
        }

        String extension = extractExtension(file.getOriginalFilename());
        if (!StringUtils.hasText(extension) || !kind.isExtensionAllowed(extension)) {
            throw new FileStorageException(
                    "Extensão não permitida. Formatos aceitos: " + kind.describeAllowedExtensions());
        }

        if (!kind.isContentTypeAllowed(file.getContentType())) {
            throw new FileStorageException("Tipo de arquivo não permitido para esta categoria.");
        }

        long maxSizeBytes = (kind == UploadKind.IMAGE ? maxImageSizeMb : maxDocumentSizeMb) * 1024 * 1024;
        if (file.getSize() > maxSizeBytes) {
            throw new FileStorageException(
                    "Arquivo muito grande. Tamanho máximo: " +
                            (kind == UploadKind.IMAGE ? maxImageSizeMb : maxDocumentSizeMb) + "MB.");
        }
    }

    private String extractExtension(String originalFilename) {
        if (!StringUtils.hasText(originalFilename) || !originalFilename.contains(".")) {
            return "";
        }
        return originalFilename
                .substring(originalFilename.lastIndexOf('.') + 1)
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]", "");
    }
}
