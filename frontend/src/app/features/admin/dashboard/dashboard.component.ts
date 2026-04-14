import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, Dashboard } from '../../../core/services/order.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dash-header fade-in">
        <div class="title-section">
          <h1 class="gradient-text">Tableau de Bord</h1>
          <p>Bienvenue dans votre espace d'administration de la Parapharmacie.</p>
        </div>
      </div>

      @if (stats) {
        <div class="kpi-grid slide-up">
          <div class="kpi-card glass-card">
            <div class="kpi-icon-wrapper orders">
              <span class="material-icons-outlined">shopping_cart</span>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Commandes</span>
              <span class="kpi-value">{{ stats.totalOrders }}</span>
            </div>
          </div>
          
          <div class="kpi-card glass-card">
            <div class="kpi-icon-wrapper revenue">
              <span class="material-icons-outlined">account_balance_wallet</span>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Revenus</span>
              <span class="kpi-value">{{ stats.totalRevenue | number:'1.0-2' }} <small>MAD</small></span>
            </div>
          </div>

          <div class="kpi-card glass-card">
            <div class="kpi-icon-wrapper products">
              <span class="material-icons-outlined">inventory_2</span>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Produits</span>
              <span class="kpi-value">{{ stats.totalProducts }}</span>
            </div>
          </div>

          <div class="kpi-card glass-card">
            <div class="kpi-icon-wrapper users">
              <span class="material-icons-outlined">group</span>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Clients</span>
              <span class="kpi-value">{{ stats.totalUsers }}</span>
            </div>
          </div>
        </div>

        <div class="content-grid slide-up-delayed">
          <!-- Left Column: Chart and Mini Stats -->
          <div class="charts-column">
            <!-- Chart Card -->
            <div class="card glass-card chart-card">
              <div class="card-header">
                <h3>Répartition des Commandes</h3>
                <span class="icon-accent material-icons-outlined">pie_chart</span>
              </div>
              <div class="chart-container">
                <canvas #statusChart></canvas>
              </div>
            </div>

            <!-- Mini Stats below chart -->
            <div class="mini-kpi-grid">
              <div class="mini-kpi danger-outline">
                <div class="mk-icon"><span class="material-icons-outlined">warning</span></div>
                <div class="mk-info">
                  <span class="mk-val">{{ stats.lowStockProducts }}</span>
                  <span class="mk-label">Stock Faible</span>
                </div>
              </div>
              <div class="mini-kpi warning-outline">
                <div class="mk-icon"><span class="material-icons-outlined">hourglass_empty</span></div>
                <div class="mk-info">
                  <span class="mk-val">{{ stats.pendingOrders }}</span>
                  <span class="mk-label">En Attente</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Recent Orders -->
          <div class="card glass-card orders-card">
            <div class="card-header border-bottom">
              <h3>Dernières Commandes</h3>
              <a routerLink="/admin/commandes" class="btn-text">
                Voir tout <span class="material-icons-outlined">arrow_forward</span>
              </a>
            </div>
            
            <div class="table-container">
              @if (stats.recentOrders.length === 0) {
                <div class="empty-state">
                  <span class="material-icons-outlined empty-icon">inbox</span>
                  <p>Aucune commande récente.</p>
                </div>
              } @else {
                <table class="modern-table">
                  <thead>
                    <tr>
                      <th>Réf</th>
                      <th>Client</th>
                      <th>Montant</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (order of stats.recentOrders.slice(0, 6); track order.id) {
                      <tr>
                        <td class="font-medium text-main">#{{ order.id }}</td>
                        <td>
                          <div class="client-cell">
                            <div class="avatar-sm">{{ order.customerName.charAt(0) | uppercase }}</div>
                            <span>{{ order.customerName }}</span>
                          </div>
                        </td>
                        <td class="font-semibold">{{ order.totalPrice | number:'1.2-2' }} DH</td>
                        <td>
                          <span class="status-badge" [class]="'badge-' + getStatusClass(order.status)">
                            {{ getStatusLabel(order.status) }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="loader-container">
          <div class="spinner"></div>
          <p>Initialisation du tableau de bord...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      --primary: #4F46E5;
      --primary-gradient: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
      --surface-light: rgba(255, 255, 255, 0.85);
      --border-light: rgba(255, 255, 255, 0.4);
      --text-main: #1e293b;
      --text-muted: #64748b;
      
      --c-pending: #f59e0b;
      --c-confirmed: #0ea5e9;
      --c-shipped: #8b5cf6;
      --c-delivered: #10b981;
      --c-cancelled: #ef4444;
      
      --shadow-premium: 0 10px 40px -10px rgba(0,0,0,0.05);
      --shadow-hover: 0 20px 40px -10px rgba(79, 70, 229, 0.15);
      --radius-xl: 20px;
    }

    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding-bottom: 40px;
      font-family: 'Inter', system-ui, sans-serif;
    }

    /* Animations */
    .fade-in { animation: fadeIn 0.6s ease-out; }
    .slide-up { animation: slideUp 0.6s ease-out both; }
    .slide-up-delayed { animation: slideUp 0.6s ease-out 0.2s both; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { 
      from { opacity: 0; transform: translateY(20px); } 
      to { opacity: 1; transform: translateY(0); } 
    }

    /* Header */
    .dash-header {
      margin-bottom: 32px;
    }
    .gradient-text {
      font-size: 32px;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    .dash-header p {
      color: var(--text-muted);
      font-size: 15px;
      margin: 0;
    }

    /* Glassmorphism Cards */
    .glass-card {
      background: var(--surface-light);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-premium);
    }
    .card { padding: 24px; display: flex; flex-direction: column; }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .kpi-card {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: default;
    }
    .kpi-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hover);
    }
    
    .kpi-icon-wrapper {
      width: 56px; height: 56px;
      border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px;
    }
    .kpi-icon-wrapper.orders { background: #EEF2FF; color: #4F46E5; }
    .kpi-icon-wrapper.revenue { background: #ECFDF5; color: #10B981; }
    .kpi-icon-wrapper.products { background: #FEF3C7; color: #D97706; }
    .kpi-icon-wrapper.users { background: #F3E8FF; color: #9333EA; }
    
    .kpi-content { display: flex; flex-direction: column; }
    .kpi-label { color: var(--text-muted); font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .kpi-value { color: var(--text-main); font-size: 26px; font-weight: 800; line-height: 1; }
    .kpi-value small { font-size: 14px; font-weight: 600; color: var(--text-muted); }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 24px;
    }
    @media (max-width: 1024px) {
      .content-grid { grid-template-columns: 1fr; }
    }

    /* Cards Header */
    .card-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px;
    }
    .card-header.border-bottom { padding-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.05); }
    .card-header h3 { font-size: 18px; font-weight: 700; color: var(--text-main); margin: 0; }
    .icon-accent { color: var(--text-muted); opacity: 0.5; }

    /* Chart */
    .chart-card { min-height: 380px; }
    .chart-container { 
      position: relative; 
      height: 280px; 
      width: 100%; 
      display: flex; align-items: center; justify-content: center;
      margin-top: 10px;
    }

    /* Mini KPIs (Under Chart) */
    .mini-kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
    .mini-kpi {
      display: flex; align-items: center; gap: 12px; padding: 16px;
      border-radius: 16px; border: 1px solid;
      background: rgba(255,255,255,0.6);
    }
    .mini-kpi.danger-outline { border-color: rgba(239, 68, 68, 0.2); }
    .mini-kpi.danger-outline .mk-icon { color: var(--c-cancelled); }
    .mini-kpi.warning-outline { border-color: rgba(245, 158, 11, 0.2); }
    .mini-kpi.warning-outline .mk-icon { color: var(--c-pending); }
    
    .mk-icon { display: flex; align-items: center; }
    .mk-info { display: flex; flex-direction: column; }
    .mk-val { font-size: 18px; font-weight: 800; color: var(--text-main); line-height: 1.2; }
    .mk-label { font-size: 11px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; }

    /* Button / Links */
    .btn-text {
      display: inline-flex; align-items: center; gap: 4px;
      color: var(--primary); font-size: 14px; font-weight: 600; text-decoration: none;
      padding: 6px 12px; border-radius: 8px; transition: background 0.2s;
    }
    .btn-text .material-icons-outlined { font-size: 16px; }
    .btn-text:hover { background: rgba(79, 70, 229, 0.08); }

    /* Modern Table */
    .table-container { overflow-x: auto; flex: 1; }
    .modern-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; margin-top: -8px; }
    .modern-table th {
      text-align: left; padding: 12px 16px;
      font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
      color: var(--text-muted); border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .modern-table td {
      padding: 16px;
      background: white;
      font-size: 14px; color: var(--text-muted);
    }
    /* Rounded corners for table rows */
    .modern-table tbody tr { box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.2s; }
    .modern-table tbody tr:hover { transform: scale(1.005); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .modern-table tbody td:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
    .modern-table tbody td:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
    
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; color: var(--text-main); }
    .text-main { color: var(--text-main); }

    .client-cell { display: flex; align-items: center; gap: 12px; }
    .avatar-sm {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--primary-gradient); color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700;
    }

    /* Badges */
    .status-badge {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
    }
    .badge-warning { background: rgba(245,158,11,0.1); color: var(--c-pending); }
    .badge-info { background: rgba(14,165,233,0.1); color: var(--c-confirmed); }
    .badge-shipped { background: rgba(139,92,246,0.1); color: var(--c-shipped); }
    .badge-success { background: rgba(16,185,129,0.1); color: var(--c-delivered); }
    .badge-danger { background: rgba(239,68,68,0.1); color: var(--c-cancelled); }

    /* Empty / Loading States */
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; color: var(--text-muted); }
    .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
    
    .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; }
    .spinner {
      width: 40px; height: 40px; border: 3px solid rgba(79, 70, 229, 0.2);
      border-top-color: var(--primary); border-radius: 50%;
      animation: spin 1s linear infinite; margin-bottom: 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
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
