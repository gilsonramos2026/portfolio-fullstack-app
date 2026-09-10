package com.portfolio.service;

import com.portfolio.domain.enums.UploadKind;
import com.portfolio.exception.FileStorageException;
import com.portfolio.service.impl.LocalFileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LocalFileStorageServiceTest {

    @TempDir
    Path tempDir;

    private LocalFileStorageService fileStorageService;

    @BeforeEach
    void setUp() {
        fileStorageService = new LocalFileStorageService();
        ReflectionTestUtils.setField(fileStorageService, "uploadDir", tempDir.toString());
        ReflectionTestUtils.setField(fileStorageService, "publicBaseUrl", "http://localhost:8080/uploads");
        ReflectionTestUtils.setField(fileStorageService, "maxImageSizeMb", 5L);
        ReflectionTestUtils.setField(fileStorageService, "maxDocumentSizeMb", 10L);
    }

    @Nested
    @DisplayName("Upload de imagem")
    class ImageUpload {

        @Test
        @DisplayName("deve armazenar um JPG válido e retornar a URL pública")
        void shouldStoreValidImage() throws IOException {
            MockMultipartFile file = new MockMultipartFile(
                    "file", "foto.jpg", "image/jpeg", "conteudo-fake".getBytes());

            String url = fileStorageService.store(file, UploadKind.IMAGE);

            assertThat(url).startsWith("http://localhost:8080/uploads/images/");
            assertThat(url).endsWith(".jpg");

            Path savedFile = tempDir.resolve("images").resolve(url.substring(url.lastIndexOf('/') + 1));
            assertThat(Files.exists(savedFile)).isTrue();
        }

        @Test
        @DisplayName("deve rejeitar extensão não permitida para imagem")
        void shouldRejectDisallowedExtension() {
            MockMultipartFile file = new MockMultipartFile(
                    "file", "malicioso.exe", "image/jpeg", "conteudo".getBytes());

            assertThatThrownBy(() -> fileStorageService.store(file, UploadKind.IMAGE))
                    .isInstanceOf(FileStorageException.class)
                    .hasMessageContaining("Extensão não permitida");
        }

        @Test
        @DisplayName("deve rejeitar content-type inconsistente com a categoria")
        void shouldRejectMismatchedContentType() {
            MockMultipartFile file = new MockMultipartFile(
                    "file", "foto.jpg", "application/pdf", "conteudo".getBytes());

            assertThatThrownBy(() -> fileStorageService.store(file, UploadKind.IMAGE))
                    .isInstanceOf(FileStorageException.class)
                    .hasMessageContaining("Tipo de arquivo não permitido");
        }

        @Test
        @DisplayName("deve rejeitar imagem acima do limite de tamanho")
        void shouldRejectOversizedImage() {
            ReflectionTestUtils.setField(fileStorageService, "maxImageSizeMb", 0L);
            MockMultipartFile file = new MockMultipartFile(
                    "file", "foto.jpg", "image/jpeg", "conteudo-qualquer".getBytes());

            assertThatThrownBy(() -> fileStorageService.store(file, UploadKind.IMAGE))
                    .isInstanceOf(FileStorageException.class)
                    .hasMessageContaining("Arquivo muito grande");
        }
    }

    @Nested
    @DisplayName("Upload de documento (currículo)")
    class DocumentUpload {

        @Test
        @DisplayName("deve armazenar um PDF válido")
        void shouldStoreValidPdf() {
            MockMultipartFile file = new MockMultipartFile(
                    "file", "curriculo.pdf", "application/pdf", "conteudo-fake".getBytes());

            String url = fileStorageService.store(file, UploadKind.DOCUMENT);

            assertThat(url).startsWith("http://localhost:8080/uploads/documents/");
            assertThat(url).endsWith(".pdf");
        }

        @Test
        @DisplayName("deve rejeitar upload de imagem no endpoint de documento")
        void shouldRejectImageAsDocument() {
            MockMultipartFile file = new MockMultipartFile(
                    "file", "foto.jpg", "image/jpeg", "conteudo".getBytes());

            assertThatThrownBy(() -> fileStorageService.store(file, UploadKind.DOCUMENT))
                    .isInstanceOf(FileStorageException.class);
        }
    }

    @Test
    @DisplayName("deve rejeitar arquivo vazio")
    void shouldRejectEmptyFile() {
        MockMultipartFile file = new MockMultipartFile("file", "foto.jpg", "image/jpeg", new byte[0]);

        assertThatThrownBy(() -> fileStorageService.store(file, UploadKind.IMAGE))
                .isInstanceOf(FileStorageException.class)
                .hasMessageContaining("Envie um arquivo válido");
    }
}
