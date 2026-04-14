package com.parapharma.mapper;

import com.parapharma.dto.ProductDTO;
import com.parapharma.entity.Product;
import com.parapharma.entity.ProductImage;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductDTO toDTO(Product product) {
        if (product == null) return null;

        return ProductDTO.builder()
                .id(product.getId())
                .title(product.getTitle())
                .slug(product.getSlug())
                .price(product.getPrice())
                .rating(product.getRating())
                .description(product.getDescription())
                .usageTips(product.getUsageTips())
                .manufacturer(product.getManufacturer())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .categorySlug(product.getCategory() != null ? product.getCategory().getSlug() : null)
                .images(mapImages(product.getImages()))
                .stockQuantity(product.getStockQuantity())
                .active(product.getActive())
                .createdAt(product.getCreatedAt())
                .build();
    }

    public List<ProductDTO> toDTOList(List<Product> products) {
        return products.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private List<ProductDTO.ProductImageDTO> mapImages(List<ProductImage> images) {
        if (images == null) return List.of();
        return images.stream()
                .map(img -> ProductDTO.ProductImageDTO.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .displayOrder(img.getDisplayOrder())
                        .isPrimary(img.getIsPrimary())
                        .build())
                .collect(Collectors.toList());
    }
}
