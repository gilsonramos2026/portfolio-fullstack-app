package com.portfolio.controller;

import com.portfolio.domain.enums.UploadKind;
import com.portfolio.dto.upload.UploadResponseDTO;
import com.portfolio.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Endpoints de upload de arquivo usados pelo painel administrativo:
 * foto de perfil, capa de projeto (ambos {@link UploadKind#IMAGE}) e
 * currículo em PDF ({@link UploadKind#DOCUMENT}).
 *
 * <p>Todas as rotas são POST e, portanto, já protegidas pelo
 * {@code AdminTokenFilter} — exigem o header {@code X-Admin-Token}.</p>
 *
 * <p>A resposta traz apenas a URL pública do arquivo salvo; o Admin ainda
 * precisa enviar essa URL no payload de {@code PUT /profile} ou
 * {@code POST/PUT /projects} para efetivamente associá-la ao registro.
 * Isso mantém upload e persistência de dados como operações independentes
 * e idempotentes.</p>
 */
@RestController
@RequestMapping("/api/uploads")
@Tag(name = "Uploads", description = "Upload de imagens e documentos usados pelo perfil e projetos")
public class UploadController {

    private final FileStorageService fileStorageService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Upload de imagem (foto de perfil ou capa de projeto)",
            description = "Admin. Aceita JPG, PNG e WEBP até o limite configurado (padrão 5MB). "
                    + "Retorna a URL pública para ser salva em `photoUrl` (Perfil) ou `imageUrl` (Projeto).",
            security = @SecurityRequirement(name = "X-Admin-Token")
    )
    @ApiResponse(responseCode = "201", description = "Upload concluído")
    @ApiResponse(responseCode = "400", description = "Arquivo ausente, vazio ou tipo/tamanho inválido")
    @ApiResponse(responseCode = "401", description = "Token administrativo ausente ou inválido")
    public ResponseEntity<UploadResponseDTO> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(store(file, UploadKind.IMAGE));
    }

    @PostMapping(value = "/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Upload de documento (currículo em PDF)",
            description = "Admin. Aceita apenas PDF até o limite configurado (padrão 10MB). "
                    + "Retorna a URL pública para ser salva em `resumeUrl` (Perfil).",
            security = @SecurityRequirement(name = "X-Admin-Token")
    )
    @ApiResponse(responseCode = "201", description = "Upload concluído")
    @ApiResponse(responseCode = "400", description = "Arquivo ausente, vazio ou tipo/tamanho inválido")
    @ApiResponse(responseCode = "401", description = "Token administrativo ausente ou inválido")
    public ResponseEntity<UploadResponseDTO> uploadDocument(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(store(file, UploadKind.DOCUMENT));
    }

    private UploadResponseDTO store(MultipartFile file, UploadKind kind) {
        String url = fileStorageService.store(file, kind);
        String fileName = url.substring(url.lastIndexOf('/', url.lastIndexOf('/') - 1) + 1);
        return new UploadResponseDTO(url, fileName, file.getSize());
    }
}
