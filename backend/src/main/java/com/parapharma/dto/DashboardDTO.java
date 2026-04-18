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

    // New fields for enhanced dashboard
    private BigDecimal todayRevenue;
    private long todayOrders;
    private double deliveryRate;       // percentage of delivered orders
    private double weekRevenueChange;  // week-over-week change percentage
    private double dayRevenueChange;   // day-over-day change percentage

    private List<MonthlySalesDTO> monthlySales;
    private List<TopProductDTO> topProducts;

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class MonthlySalesDTO {
        private int year;
        private int month;
        private BigDecimal revenue;
        private long orderCount;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class TopProductDTO {
        private int rank;
        private String productName;
        private BigDecimal totalSales;
        private long quantitySold;
    }
}
