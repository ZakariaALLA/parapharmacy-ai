package com.parapharma.repository;

import com.parapharma.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    // Top selling products: returns productTitle, total revenue, total quantity sold
    @Query("SELECT oi.product.title, SUM(oi.unitPrice * oi.quantity), SUM(oi.quantity) " +
           "FROM OrderItem oi GROUP BY oi.product.id, oi.product.title " +
           "ORDER BY SUM(oi.unitPrice * oi.quantity) DESC")
    List<Object[]> findTopSellingProducts();
}
