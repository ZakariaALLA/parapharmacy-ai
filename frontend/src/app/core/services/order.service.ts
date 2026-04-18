import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderCreate {
  customerName: string;
  phoneNumber: string;
  address: string;
  city: string;
  items: { productId: number; quantity: number }[];
}

export interface Order {
  id: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  city: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
}

export interface Dashboard {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  todayRevenue: number;
  todayOrders: number;
  deliveryRate: number;
  weekRevenueChange: number;
  dayRevenueChange: number;
  monthlySales: MonthlySales[];
  topProducts: TopProduct[];
}

export interface MonthlySales {
  year: number;
  month: number;
  revenue: number;
  orderCount: number;
}

export interface TopProduct {
  rank: number;
  productName: string;
  totalSales: number;
  quantitySold: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private adminUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  createOrder(order: OrderCreate): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  getOrders(page = 0, size = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status });
  }

  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.adminUrl}/dashboard`);
  }
}
