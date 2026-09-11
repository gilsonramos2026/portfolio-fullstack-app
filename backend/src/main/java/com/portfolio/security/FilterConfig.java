package com.portfolio.security;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<AdminTokenFilter> adminTokenFilterRegistration(AdminTokenFilter filter) {
        FilterRegistrationBean<AdminTokenFilter> registration = new FilterRegistrationBean<>(filter);
        // Intercepta as requisições delegando a ordem correta para o ecossistema do Spring
        registration.addUrlPatterns("/*");
        // 🚀 Ajustado para executar imediatamente após o filtro do CORS
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 1);
        registration.setName("adminTokenFilter");
        return registration;
    }
}
