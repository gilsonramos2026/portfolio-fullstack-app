package com.portfolio.exception;

/**
 * Lançada quando um recurso solicitado (perfil, endereço ou projeto)
 * não é encontrado no banco de dados.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException forEntity(String entityName, Long id) {
        return new ResourceNotFoundException(entityName + " não encontrado(a) com id: " + id);
    }
}
