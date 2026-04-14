package com.parapharma.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private String customerName;
    private String phoneNumber;
    private String address;
    private String city;
    private List<OrderItemDTO> items;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class OrderItemDTO {
        private Long id;
        private Long productId;
        private String productTitle;
        private String productImage;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}
