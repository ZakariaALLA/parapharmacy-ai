import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, Dashboard } from '../../../core/services/order.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: Dashboard | null = null;
  chart: any;

  @ViewChild('statusChart') statusChartRef!: ElementRef;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getDashboard().subscribe({
      next: (data) => {
        this.stats = data;
        // Wait for DOM to update and render the canvas
        setTimeout(() => this.initChart(), 50);
      },
      error: (err) => console.error('Failed to load dashboard stats', err)
    });
  }

  initChart(): void {
    if (!this.statusChartRef || !this.stats) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const total = this.stats.pendingOrders + this.stats.confirmedOrders + this.stats.shippedOrders + this.stats.deliveredOrders;
    if (total === 0) return; // Prevent charting if zero data

    const ctx = this.statusChartRef.nativeElement.getContext('2d');
    
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['En attente', 'Confirmées', 'Expédiées', 'Livrées'],
        datasets: [{
          data: [
            this.stats.pendingOrders, 
            this.stats.confirmedOrders, 
            this.stats.shippedOrders, 
            this.stats.deliveredOrders
          ],
          backgroundColor: [
            '#f59e0b', // pending
            '#0ea5e9', // confirmed
            '#8b5cf6', // shipped
            '#10b981'  // delivered
          ],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 10
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                family: "'Inter', sans-serif",
                size: 13,
                weight: 'lighter'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: "'Inter', sans-serif", size: 13 },
            bodyFont: { family: "'Inter', sans-serif", size: 14, weight: 'bold' },
            padding: 12,
            cornerRadius: 8,
            boxPadding: 6
          }
        },
        cutout: '75%',
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
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
}
