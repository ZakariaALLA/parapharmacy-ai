package com.parapharma.mapper;

import com.parapharma.dto.OrderDTO;
import com.parapharma.entity.Order;
import com.parapharma.entity.OrderItem;
import com.parapharma.entity.ProductImage;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderDTO toDTO(Order order) {
        if (order == null) return null;

        return OrderDTO.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .phoneNumber(order.getPhoneNumber())
                .address(order.getAddress())
                .city(order.getCity())
                .items(mapItems(order.getItems()))
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build();
    }

    public List<OrderDTO> toDTOList(List<Order> orders) {
        return orders.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private List<OrderDTO.OrderItemDTO> mapItems(List<OrderItem> items) {
        if (items == null) return List.of();
        return items.stream()
                .map(item -> OrderDTO.OrderItemDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .productTitle(item.getProduct() != null ? item.getProduct().getTitle() : "Produit supprimé")
                        .productImage(item.getProduct() != null ? getPrimaryImage(item.getProduct().getImages()) : null)
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .collect(Collectors.toList());
    }

    private String getPrimaryImage(List<ProductImage> images) {
        if (images == null || images.isEmpty()) return null;
        return images.stream()
                .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(images.get(0).getImageUrl());
    }
}
