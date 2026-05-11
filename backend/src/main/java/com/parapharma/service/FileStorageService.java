package com.parapharma.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {

    private final Cloudinary cloudinary;

    /**
     * Uploads a file to Cloudinary and returns the secure HTTPS URL.
     * Images are stored in the "parapharma/products" folder on Cloudinary.
     */
    public String storeFile(MultipartFile file) {
        try {
            log.info("Envoi de l'image '{}' vers Cloudinary...", file.getOriginalFilename());

            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "parapharma/products",
                            "resource_type", "image"
                    )
            );

            String secureUrl = (String) result.get("secure_url");
            log.info("Image uploadée avec succès : {}", secureUrl);
            return secureUrl;

        } catch (IOException e) {
            log.error("Erreur lors de l'upload de l'image vers Cloudinary", e);
            throw new RuntimeException("Impossible d'uploader l'image", e);
        }
    }

    /**
     * Deletes an image from Cloudinary by extracting its public_id from the URL.
     * Cloudinary URLs follow the pattern:
     *   https://res.cloudinary.com/<cloud>/image/upload/v<version>/<folder>/<public_id>.<ext>
     */
    public void deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }
        try {
            // Extract public_id: everything after "/upload/" and before the file extension
            String publicId = extractPublicId(imageUrl);
            log.info("Suppression de l'image Cloudinary : {}", publicId);

            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Résultat de la suppression : {}", result.get("result"));

        } catch (IOException e) {
            log.warn("Impossible de supprimer l'image Cloudinary : {}", imageUrl, e);
        }
    }

    /**
     * Parses a Cloudinary URL and returns the public_id (with folder, without extension).
     * Example input:  https://res.cloudinary.com/mycloud/image/upload/v1234567890/parapharma/products/abc123.jpg
     * Example output: parapharma/products/abc123
     */
    private String extractPublicId(String url) {
        // Find the "/upload/" segment and take everything after it
        int uploadIdx = url.indexOf("/upload/");
        if (uploadIdx == -1) {
            // Fallback: not a Cloudinary URL (e.g. old local path) — skip
            log.warn("URL non-Cloudinary ignorée pour la suppression : {}", url);
            return null;
        }
        String afterUpload = url.substring(uploadIdx + "/upload/".length());

        // Strip version segment if present (e.g. "v1234567890/")
        if (afterUpload.startsWith("v") && afterUpload.indexOf('/') > 1) {
            afterUpload = afterUpload.substring(afterUpload.indexOf('/') + 1);
        }

        // Remove file extension
        int dotIdx = afterUpload.lastIndexOf('.');
        if (dotIdx != -1) {
            afterUpload = afterUpload.substring(0, dotIdx);
        }
        return afterUpload;
    }
}
