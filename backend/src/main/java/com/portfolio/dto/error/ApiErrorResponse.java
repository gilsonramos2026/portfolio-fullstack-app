package com.portfolio.dto.error;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Formato padronizado de erro retornado por toda a API,
 * produzido pelo {@code GlobalExceptionHandler}.
 */
public record ApiErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path,
        List<String> details
) {
    public static ApiErrorResponse of(int status, String error, String message, String path) {
        return new ApiErrorResponse(LocalDateTime.now(), status, error, message, path, List.of());
    }

    public static ApiErrorResponse of(int status, String error, String message, String path, List<String> details) {
        return new ApiErrorResponse(LocalDateTime.now(), status, error, message, path, details);
    }
}
