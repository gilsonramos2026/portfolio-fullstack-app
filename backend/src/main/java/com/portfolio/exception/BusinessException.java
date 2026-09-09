package com.portfolio.exception;

/**
 * Lançada quando uma regra de negócio é violada
 * (ex.: tentativa de operação inválida sobre o estado atual do recurso).
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
