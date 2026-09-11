package com.portfolio.security;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<AdminTokenFilter> adminTokenFilterRegistration(AdminTokenFilter filter) {
        FilterRegistrationBean<AdminTokenFilter> registration = new FilterRegistrationBean<>(filter);
        registration.addUrlPatterns("/api/*");
        registration.setOrder(10); // Executa após as configurações globais de CORS do Spring
        registration.setName("adminTokenFilter");
        return registration;
    }
}
