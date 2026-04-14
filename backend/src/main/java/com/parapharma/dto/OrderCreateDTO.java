package com.parapharma.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OrderCreateDTO {

    @NotBlank(message = "Le nom complet est obligatoire")
    private String customerName;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "^(\\+212|0)[\\s\\-]*[5-7]([\\s\\-]*\\d){8}$", message = "Numéro de téléphone marocain invalide")
    private String phoneNumber;

    @NotBlank(message = "L'adresse est obligatoire")
    private String address;

    @NotBlank(message = "La ville est obligatoire")
    private String city;

    @NotEmpty(message = "La commande doit contenir au moins un produit")
    @Valid
    private List<OrderItemCreateDTO> items;

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class OrderItemCreateDTO {

        @NotNull(message = "L'identifiant du produit est obligatoire")
        private Long productId;

        @NotNull(message = "La quantité est obligatoire")
        @Min(value = 1, message = "La quantité minimale est 1")
        private Integer quantity;
    }
}
