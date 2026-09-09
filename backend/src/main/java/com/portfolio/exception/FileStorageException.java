package com.portfolio.exception;

/**
 * Lançada quando um upload é rejeitado por regra de negócio do armazenamento
 * de arquivos: tipo de conteúdo não permitido, arquivo vazio, tamanho acima
 * do limite ou falha de I/O ao persistir no disco.
 */
public class FileStorageException extends RuntimeException {

    public FileStorageException(String message) {
        super(message);
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
