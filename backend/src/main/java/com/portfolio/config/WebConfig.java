package com.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.nio.file.Path;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Declaramos as URLs exatas explicitamente. Isso é 100% compatível com allowCredentials(true)
                // e impede qualquer crash de inicialização (initializeBean) no boot.
                .allowedOrigins(
                        "http://localhost:5173",
                        "https://portfolio-fullstack-app.vercel.app",        // Origem antiga acusada no seu erro
                        "https://aplicativo-fullstack-portfolio.vercel.app"  // Seu domínio novo da Vercel
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("X-Admin-Token", "Content-Type", "Authorization", "Accept", "Origin")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Path.of(uploadDir).toAbsolutePath().normalize().toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath)
                .setCachePeriod(3600)
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws java.io.IOException {
                        Resource requested = new FileSystemResource(Path.of(uploadDir, resourcePath));
                        return requested.exists() && requested.isReadable() ? requested : null;
                    }
                });
    }
}
