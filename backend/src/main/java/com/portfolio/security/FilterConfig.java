package com.portfolio.security;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Registra explicitamente o {@link AdminTokenFilter} no contêiner de
 * servlets, restringindo sua atuação ao namespace {@code /api/*} da API.
 */
@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<AdminTokenFilter> adminTokenFilterRegistration(AdminTokenFilter filter) {
        FilterRegistrationBean<AdminTokenFilter> registration = new FilterRegistrationBean<>(filter);
        registration.addUrlPatterns("/api/*");
        registration.setOrder(1);
        registration.setName("adminTokenFilter");
        return registration;
    }
}
