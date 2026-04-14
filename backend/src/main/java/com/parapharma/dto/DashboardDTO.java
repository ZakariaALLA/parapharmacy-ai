package com.parapharma.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DashboardDTO {
    private long totalOrders;
    private long pendingOrders;
    private long confirmedOrders;
    private long shippedOrders;
    private long deliveredOrders;
    private BigDecimal totalRevenue;
    private long totalProducts;
    private long lowStockProducts;
    private long totalUsers;
    private List<OrderDTO> recentOrders;
}
