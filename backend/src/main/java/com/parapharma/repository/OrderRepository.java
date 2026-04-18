package com.parapharma.repository;

import com.parapharma.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);

    long countByStatus(Order.OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.status != 'PENDING'")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o")
    BigDecimal calculateGrossRevenue();

    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id")
    java.util.Optional<Order> findByIdWithItems(@Param("id") Long id);

    // Today's revenue and order count
    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.createdAt >= :start")
    BigDecimal calculateRevenueAfter(@Param("start") LocalDateTime start);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :start")
    long countOrdersAfter(@Param("start") LocalDateTime start);

    // Revenue between two dates (for comparison calculations)
    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end")
    BigDecimal calculateRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Monthly sales aggregation - returns year, month, sum of revenue, count of orders
    @Query("SELECT YEAR(o.createdAt), MONTH(o.createdAt), COALESCE(SUM(o.totalPrice), 0), COUNT(o) " +
           "FROM Order o GROUP BY YEAR(o.createdAt), MONTH(o.createdAt) " +
           "ORDER BY YEAR(o.createdAt), MONTH(o.createdAt)")
    List<Object[]> findMonthlySales();
}
