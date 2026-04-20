package com.parapharma.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = new java.io.File(uploadDir).getAbsolutePath();
        if (!absolutePath.endsWith("/") && !absolutePath.endsWith("\\")) {
            absolutePath += "/";
        }
        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations("file:" + absolutePath);
    }
}
