package com.parapharma.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductCreateDTO {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.01", message = "Le prix doit être supérieur à 0")
    private BigDecimal price;

    private String description;

    private String usageTips;

    private String manufacturer;

    @NotNull(message = "La catégorie est obligatoire")
    private Long categoryId;

    @Min(value = 0, message = "Le stock ne peut pas être négatif")
    private Integer stockQuantity = 0;

    private Double rating = 0.0;

    private Boolean active = true;
}
