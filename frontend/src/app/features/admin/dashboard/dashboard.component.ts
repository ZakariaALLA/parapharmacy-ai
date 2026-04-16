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

  constructor(private orderService: OrderService) { }

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

    // Create gradient for chart if needed, or use vibrant solid colors
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
            '#f59e0b', // warning/orange
            '#3b82f6', // info/blue
            '#8b5cf6', // shipped/purple
            '#10b981'  // success/green
          ],
          borderWidth: 0,
          hoverOffset: 8,
          borderRadius: 4 // Add rounded corners to chart segments
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 20
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              color: '#475569',
              font: {
                family: "'Inter', -apple-system, sans-serif",
                size: 13,
                weight: 'normal'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleFont: { family: "'Inter', sans-serif", size: 13, weight: 'normal' },
            bodyFont: { family: "'Inter', sans-serif", size: 15, weight: 'bold' },
            padding: 16,
            cornerRadius: 12,
            boxPadding: 8,
            usePointStyle: true,
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1
          }
        },
        cutout: '78%', // Sleeker, thinner donut
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1000,
          easing: 'easeOutQuart'
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
