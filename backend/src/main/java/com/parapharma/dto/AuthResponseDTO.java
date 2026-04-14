package com.parapharma.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AuthResponseDTO {
    private String token;
    private String email;
    private String fullName;
    private String role;
}
