package com.parapharma.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        Path path = Paths.get(uploadDir).toAbsolutePath();
        try {
            Files.createDirectories(path);
            log.info("Répertoire d'upload initialisé à : {}", path);
        } catch (IOException e) {
            log.error("Erreur lors de la création du répertoire d'upload : {}", path, e);
            throw new RuntimeException("Impossible de créer le répertoire d'upload", e);
        }
    }

    public String storeFile(MultipartFile file) {
        try {
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID().toString() + extension;
            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().resolve(fileName);

            log.info("Stockage du fichier : {} vers {}", originalFileName, targetLocation);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/images/" + fileName;
        } catch (IOException e) {
            log.error("Erreur lors du stockage du fichier", e);
            throw new RuntimeException("Impossible de stocker le fichier", e);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir).toAbsolutePath().resolve(fileName);
            log.info("Suppression du fichier : {}", filePath);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Impossible de supprimer le fichier physique : {}", fileUrl);
        }
    }
}
