package com.parapharma.controller;

import com.parapharma.dto.AuthRequestDTO;
import com.parapharma.dto.AuthResponseDTO;
import com.parapharma.dto.RegisterDTO;
import com.parapharma.dto.UserUpdateDTO;
import com.parapharma.entity.User;
import com.parapharma.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterDTO dto) {
        return ResponseEntity.ok(authService.register(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "address", user.getAddress() != null ? user.getAddress() : "",
                "city", user.getCity() != null ? user.getCity() : "",
                "zipCode", user.getZipCode() != null ? user.getZipCode() : "",
                "role", user.getRole().name()));
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UserUpdateDTO dto) {
        User user = authService.updateProfile(authentication.getName(), dto);
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "address", user.getAddress() != null ? user.getAddress() : "",
                "city", user.getCity() != null ? user.getCity() : "",
                "zipCode", user.getZipCode() != null ? user.getZipCode() : "",
                "role", user.getRole().name(),
                "message", "Profil mis à jour avec succès"));
    }
}
