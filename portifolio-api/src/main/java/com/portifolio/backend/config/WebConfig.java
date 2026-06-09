package com.portifolio.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera absolutamente todos os endpoints da API
                .allowedOrigins("http://localhost:5173", "http://localhost:3000", "https://vercel.app") // Permite conexões do seu front local e futuro link de produção
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // Permite todos os verbos HTTP
                .allowedHeaders("*") // Libera o envio de qualquer Header (incluindo o seu X-Admin-Key)
                .allowCredentials(true)
                .maxAge(3600); // Guarda a autorização em cache no navegador por 1 hora
    }
}

