package com.portfolio.exception;

/** Lançada quando um cliente excede o limite de requisições permitido (HTTP 429). */
public class RateLimitExceededException extends RuntimeException {
    public RateLimitExceededException(String message) {
        super(message);
    }
}
