package com.parapharma.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String title;
    private String slug;
    private BigDecimal price;
    private Double rating;
    private String description;
    private String usageTips;
    private String manufacturer;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private List<ProductImageDTO> images;
    private Integer stockQuantity;
    private Boolean active;
    private LocalDateTime createdAt;
    private Integer reviewCount;

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class ProductImageDTO {
        private Long id;
        private String imageUrl;
        private Integer displayOrder;
        private Boolean isPrimary;
    }
}
