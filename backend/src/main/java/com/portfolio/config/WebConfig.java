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

/**
 * Configuração web transversal:
 *
 * <ul>
 *   <li><b>CORS</b>: libera as origens do frontend (dev e produção) para
 *       as rotas {@code /api/**}. Sem isso, o navegador bloqueia toda
 *       chamada do frontend (porta diferente do backend).</li>
 *   <li><b>Recursos estáticos</b>: expõe o diretório local de uploads
 *       ({@code app.upload.dir}) em {@code /uploads/**}, para que as URLs
 *       retornadas por {@code UploadController} sejam acessíveis
 *       publicamente (fotos, capas de projeto e currículo são conteúdo
 *       público do portfolio).</li>
 * </ul>
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
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
