package com.parapharma.service;

import com.parapharma.dto.OrderCreateDTO;
import com.parapharma.dto.OrderDTO;
import com.parapharma.dto.DashboardDTO;
import com.parapharma.entity.Order;
import com.parapharma.entity.OrderItem;
import com.parapharma.entity.Product;
import com.parapharma.exception.ResourceNotFoundException;
import com.parapharma.mapper.OrderMapper;
import com.parapharma.repository.OrderItemRepository;
import com.parapharma.repository.OrderRepository;
import com.parapharma.repository.ProductRepository;
import com.parapharma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final OrderItemRepository orderItemRepository;

    public OrderDTO createOrder(OrderCreateDTO dto) {
        Order order = Order.builder()
                .customerName(dto.getCustomerName())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .city(dto.getCity())
                .status(Order.OrderStatus.PENDING)
                .build();

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderCreateDTO.OrderItemCreateDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", itemDto.getProductId()));

            if (product.getStockQuantity() < itemDto.getQuantity()) {
                throw new IllegalArgumentException(
                        "Stock insuffisant pour le produit: " + product.getTitle() +
                        " (disponible: " + product.getStockQuantity() + ")");
            }

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemDto.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            order.addItem(orderItem);

            totalPrice = totalPrice.add(
                    product.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));

            // Decrease stock
            product.setStockQuantity(product.getStockQuantity() - itemDto.getQuantity());
            productRepository.save(product);
        }

        order.setTotalPrice(totalPrice);
        Order saved = orderRepository.save(order);
        return orderMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(orderMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande", "id", id));
        return orderMapper.toDTO(order);
    }

    public OrderDTO updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande", "id", id));

        try {
            order.setStatus(Order.OrderStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Statut invalide: " + status);
        }

        Order saved = orderRepository.save(order);
        return orderMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public DashboardDTO getDashboardStats() {
        List<OrderDTO> recentOrders = orderRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, 10))
                .map(orderMapper::toDTO)
                .getContent();

        // Basic counts
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long confirmedOrders = orderRepository.countByStatus(Order.OrderStatus.CONFIRMED);
        long shippedOrders = orderRepository.countByStatus(Order.OrderStatus.SHIPPED);
        long deliveredOrders = orderRepository.countByStatus(Order.OrderStatus.DELIVERED);
        BigDecimal totalRevenue = orderRepository.calculateGrossRevenue();

        // Today's stats
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        BigDecimal todayRevenue = orderRepository.calculateRevenueAfter(todayStart);
        long todayOrders = orderRepository.countOrdersAfter(todayStart);

        // Delivery rate
        double deliveryRate = totalOrders > 0
                ? (double) deliveredOrders / totalOrders * 100
                : 0;

        // Week-over-week revenue change
        LocalDateTime thisWeekStart = LocalDate.now().minusDays(7).atStartOfDay();
        LocalDateTime lastWeekStart = LocalDate.now().minusDays(14).atStartOfDay();
        BigDecimal thisWeekRevenue = orderRepository.calculateRevenueBetween(thisWeekStart, todayStart.plusDays(1));
        BigDecimal lastWeekRevenue = orderRepository.calculateRevenueBetween(lastWeekStart, thisWeekStart);
        double weekRevenueChange = lastWeekRevenue.compareTo(BigDecimal.ZERO) > 0
                ? thisWeekRevenue.subtract(lastWeekRevenue)
                    .divide(lastWeekRevenue, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0;

        // Day-over-day revenue change
        LocalDateTime yesterdayStart = LocalDate.now().minusDays(1).atStartOfDay();
        BigDecimal todayRev = orderRepository.calculateRevenueBetween(todayStart, todayStart.plusDays(1));
        BigDecimal yesterdayRev = orderRepository.calculateRevenueBetween(yesterdayStart, todayStart);
        double dayRevenueChange = yesterdayRev.compareTo(BigDecimal.ZERO) > 0
                ? todayRev.subtract(yesterdayRev)
                    .divide(yesterdayRev, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0;

        // Monthly sales aggregation
        List<Object[]> rawMonthlySales = orderRepository.findMonthlySales();
        List<DashboardDTO.MonthlySalesDTO> monthlySales = rawMonthlySales.stream()
                .map(row -> DashboardDTO.MonthlySalesDTO.builder()
                        .year(((Number) row[0]).intValue())
                        .month(((Number) row[1]).intValue())
                        .revenue((BigDecimal) row[2])
                        .orderCount(((Number) row[3]).longValue())
                        .build())
                .collect(Collectors.toList());

        // Top selling products (limit to 7)
        List<Object[]> rawTopProducts = orderItemRepository.findTopSellingProducts();
        List<DashboardDTO.TopProductDTO> topProducts = new ArrayList<>();
        int rank = 1;
        for (Object[] row : rawTopProducts) {
            if (rank > 7) break;
            topProducts.add(DashboardDTO.TopProductDTO.builder()
                    .rank(rank++)
                    .productName((String) row[0])
                    .totalSales((BigDecimal) row[1])
                    .quantitySold(((Number) row[2]).longValue())
                    .build());
        }

        return DashboardDTO.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .confirmedOrders(confirmedOrders)
                .shippedOrders(shippedOrders)
                .deliveredOrders(deliveredOrders)
                .totalRevenue(totalRevenue)
                .totalProducts(productRepository.countByActiveTrue())
                .lowStockProducts(productRepository.countLowStock(10))
                .totalUsers(userRepository.count())
                .recentOrders(recentOrders)
                .todayRevenue(todayRevenue)
                .todayOrders(todayOrders)
                .deliveryRate(Math.round(deliveryRate * 10.0) / 10.0)
                .weekRevenueChange(Math.round(weekRevenueChange * 10.0) / 10.0)
                .dayRevenueChange(Math.round(dayRevenueChange * 10.0) / 10.0)
                .monthlySales(monthlySales)
                .topProducts(topProducts)
                .build();
    }
}
