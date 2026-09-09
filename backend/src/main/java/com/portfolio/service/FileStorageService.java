package com.portfolio.service;

import com.portfolio.backend.domain.UploadKind;
import org.springframework.web.multipart.MultipartFile;

/**
 * Abstrai a persistência física dos arquivos enviados pelo Admin. A
 * implementação atual grava em disco local; trocar para um provider de
 * object storage (S3, GCS, Cloudinary...) significa apenas criar uma nova
 * implementação desta interface, sem tocar em controller/service de negócio.
 */
public interface FileStorageService {

    /**
     * Valida, persiste o arquivo enviado e retorna a URL pública para
     * acesso (usada diretamente nos campos {@code photoUrl}, {@code
     * resumeUrl} e {@code imageUrl} do domínio).
     *
     * @throws com.portfolio.backend.exception.FileStorageException se o
     *         arquivo estiver vazio, tiver extensão/tipo não permitido para
     *         a categoria informada, ou ocorrer falha de I/O.
     */
    String store(MultipartFile file, UploadKind kind);
}
