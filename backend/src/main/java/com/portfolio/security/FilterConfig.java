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
        // Intercepta TODAS as requisições para garantir que o CORS funcione antes de qualquer rota
        registration.addUrlPatterns("/*");
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        registration.setName("adminTokenFilter");
        return registration;
    }
}
