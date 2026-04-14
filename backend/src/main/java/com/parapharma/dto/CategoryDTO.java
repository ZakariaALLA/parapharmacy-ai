package com.parapharma.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CategoryDTO {
    private Long id;

    @NotBlank(message = "Le nom de la catégorie est obligatoire")
    private String name;

    private String slug;
    private String description;
    private String imageUrl;
    private Long productCount;
}
