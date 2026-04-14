import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  statuses = [
    { value: 'PENDING', label: 'En attente', class: 'pending' },
    { value: 'CONFIRMED', label: 'Confirmée', class: 'confirmed' },
    { value: 'SHIPPED', label: 'Expédiée', class: 'shipped' },
    { value: 'DELIVERED', label: 'Livrée', class: 'delivered' },
    { value: 'CANCELLED', label: 'Annulée', class: 'cancelled' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders(this.currentPage, 20).subscribe((page: any) => {
      this.orders = page.content;
      this.totalPages = page.totalPages;
      this.totalElements = page.totalElements;
    });
  }

  viewOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe(order => this.selectedOrder = order);
  }

  updateStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe(updated => {
      this.selectedOrder = updated;
      this.loadOrders();
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'En attente', 'CONFIRMED': 'Confirmée',
      'SHIPPED': 'Expédiée', 'DELIVERED': 'Livrée', 'CANCELLED': 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'PENDING': 'warning', 'CONFIRMED': 'info',
      'SHIPPED': 'shipped', 'DELIVERED': 'success', 'CANCELLED': 'danger'
    };
    return classes[status] || 'info';
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }
}
