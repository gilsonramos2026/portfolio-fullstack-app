package com.portfolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Habilita o suporte a auditoria automática do Spring Data JPA
 * (preenchimento de {@code createdAt}/{@code updatedAt} via
 * {@code @EntityListeners(AuditingEntityListener.class)}).
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
