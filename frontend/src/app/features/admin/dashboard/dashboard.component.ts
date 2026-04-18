import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
  salesChart: any;
  activeTab: 'sales' | 'orders' = 'sales';
  activeTimeFilter: 'all' = 'all';

  @ViewChild('salesTrendChart') salesTrendChartRef!: ElementRef;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getDashboard().subscribe({
      next: (data) => {
        this.stats = data;
        setTimeout(() => this.initSalesChart(), 100);
      },
      error: (err) => console.error('Failed to load dashboard stats', err)
    });
  }

  initSalesChart(): void {
    if (!this.salesTrendChartRef || !this.stats) return;

    if (this.salesChart) {
      this.salesChart.destroy();
    }

    const ctx = this.salesTrendChartRef.nativeElement.getContext('2d');
    const monthlySales = this.stats.monthlySales || [];

    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    const labels = monthlySales.map(m => {
      const monthLabel = monthNames[m.month - 1] || `M${m.month}`;
      return `${monthLabel} ${m.year}`;
    });

    const revenueData = monthlySales.map(m => m.revenue);
    const orderData = monthlySales.map(m => m.orderCount);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, 'rgba(24, 144, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(24, 144, 255, 0.4)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 350);
    gradient2.addColorStop(0, 'rgba(47, 194, 163, 0.9)');
    gradient2.addColorStop(1, 'rgba(47, 194, 163, 0.4)');

    this.salesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Revenus (MAD)',
            data: revenueData,
            backgroundColor: gradient,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          },
          {
            label: 'Commandes',
            data: orderData,
            backgroundColor: gradient2,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { family: "'Inter', sans-serif", size: 13 },
            bodyFont: { family: "'Inter', sans-serif", size: 12 },
            padding: 12,
            cornerRadius: 8,
            boxPadding: 6
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#8c8c8c',
              font: { family: "'Inter', sans-serif", size: 12 }
            },
            border: {
              display: false
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.04)'
            },
            ticks: {
              color: '#8c8c8c',
              font: { family: "'Inter', sans-serif", size: 12 }
            },
            border: {
              display: false
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  formatCurrency(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K';
    }
    return value.toFixed(0);
  }

  getChangeIcon(value: number): string {
    return value >= 0 ? 'trending_up' : 'trending_down';
  }

  getChangeClass(value: number): string {
    return value >= 0 ? 'positive' : 'negative';
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-default';
  }
}
