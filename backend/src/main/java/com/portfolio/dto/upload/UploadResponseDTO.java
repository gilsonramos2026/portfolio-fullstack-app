package com.portfolio.dto.upload;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "URL pública do arquivo enviado, pronta para ser salva em photoUrl/resumeUrl/imageUrl")
public record UploadResponseDTO(
        @Schema(example = "http://localhost:8080/uploads/images/9f1c9c2e-...-4b2a.jpg")
        String url,

        @Schema(example = "images/9f1c9c2e-...-4b2a.jpg")
        String fileName,

        @Schema(example = "184320")
        long sizeInBytes
) {
}
