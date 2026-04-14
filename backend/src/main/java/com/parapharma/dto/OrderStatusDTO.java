package com.parapharma.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OrderStatusDTO {

    @NotBlank(message = "Le statut est obligatoire")
    @Pattern(regexp = "PENDING|CONFIRMED|SHIPPED|DELIVERED", message = "Statut invalide")
    private String status;
}
