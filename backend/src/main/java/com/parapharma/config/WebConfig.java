package com.parapharma.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * WebMvcConfigurer kept for future CORS / interceptor configuration.
 * Static file serving for uploads has been removed — images are now
 * served directly from Cloudinary CDN.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // No local static resource mapping needed — see CloudinaryConfig
}
