package com.parapharma.service;

import com.parapharma.dto.OrderCreateDTO;
import com.parapharma.dto.OrderDTO;
import com.parapharma.dto.DashboardDTO;
import com.parapharma.entity.Order;
import com.parapharma.entity.OrderItem;
import com.parapharma.entity.Product;
import com.parapharma.exception.ResourceNotFoundException;
import com.parapharma.mapper.OrderMapper;
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
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

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

        return DashboardDTO.builder()
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(Order.OrderStatus.PENDING))
                .confirmedOrders(orderRepository.countByStatus(Order.OrderStatus.CONFIRMED))
                .shippedOrders(orderRepository.countByStatus(Order.OrderStatus.SHIPPED))
                .deliveredOrders(orderRepository.countByStatus(Order.OrderStatus.DELIVERED))
                .totalRevenue(orderRepository.calculateGrossRevenue())
                .totalProducts(productRepository.countByActiveTrue())
                .lowStockProducts(productRepository.countLowStock(10))
                .totalUsers(userRepository.count())
                .recentOrders(recentOrders)
                .build();
    }
}
