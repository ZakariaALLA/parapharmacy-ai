package com.parapharma.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductFilterDTO {
    private String keyword;
    private Long categoryId;
    private String manufacturer;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Double minRating;
    private Boolean inStock;
    private String sortBy = "createdAt";  // title, price, rating, createdAt
    private String sortDir = "desc";       // asc, desc
    private int page = 0;
    private int size = 12;
}
