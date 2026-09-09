package com.portfolio.domain.enums;

import java.util.Set;

/**
 * Categorias de arquivo aceitas pelo {@code UploadController}. Cada
 * categoria define seu próprio conjunto de extensões permitidas e limite
 * de tamanho, para que uma foto de perfil não possa ser trocada por um
 * executável disfarçado de ".jpg", por exemplo.
 */
public enum UploadKind {

    IMAGE("images", Set.of("jpg", "jpeg", "png", "webp"), Set.of(
            "image/jpeg", "image/png", "image/webp")),

    DOCUMENT("documents", Set.of("pdf"), Set.of("application/pdf"));

    private final String subFolder;
    private final Set<String> allowedExtensions;
    private final Set<String> allowedContentTypes;

    UploadKind(String subFolder, Set<String> allowedExtensions, Set<String> allowedContentTypes) {
        this.subFolder = subFolder;
        this.allowedExtensions = allowedExtensions;
        this.allowedContentTypes = allowedContentTypes;
    }

    public String getSubFolder() {
        return subFolder;
    }

    public boolean isExtensionAllowed(String extension) {
        return allowedExtensions.contains(extension.toLowerCase());
    }

    public boolean isContentTypeAllowed(String contentType) {
        return contentType != null && allowedContentTypes.contains(contentType.toLowerCase());
    }

    public String describeAllowedExtensions() {
        return String.join(", ", allowedExtensions);
    }
}

