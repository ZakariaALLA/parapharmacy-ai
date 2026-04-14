import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="sidebar-brand">
          <span class="logo-icon">💊</span>
          <div>
            <span class="brand-name">ParaPharma</span>
            <span class="brand-sub">Administration</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-item">
            <span class="material-icons-outlined">dashboard</span>
            Tableau de bord
          </a>
          <a routerLink="/admin/produits" routerLinkActive="active" class="nav-item">
            <span class="material-icons-outlined">inventory_2</span>
            Produits
          </a>
          <a routerLink="/admin/commandes" routerLinkActive="active" class="nav-item">
            <span class="material-icons-outlined">receipt_long</span>
            Commandes
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="nav-item">
            <span class="material-icons-outlined">storefront</span>
            Voir la boutique
          </a>
          <button class="nav-item logout" (click)="auth.logout()">
            <span class="material-icons-outlined">logout</span>
            Déconnexion
          </button>
        </div>
      </aside>

      <main class="admin-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: grid;
      grid-template-columns: var(--sidebar-width) 1fr;
      min-height: 100vh;
    }

    .admin-sidebar {
      background: var(--grey-900);
      color: white;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--sidebar-width);
      z-index: 1001;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 8px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      margin-bottom: 16px;
    }
    .sidebar-brand .logo-icon { font-size: 28px; }
    .brand-name { display: block; font-size: 16px; font-weight: 800; }
    .brand-sub { display: block; font-size: 10px; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; }

    .sidebar-nav { flex: 1; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
      color: var(--grey-400);
      transition: all var(--transition-fast);
      margin-bottom: 2px;
      text-decoration: none;
      border: none;
      background: none;
      width: 100%;
      cursor: pointer;
      text-align: left;
    }
    .nav-item:hover { background: rgba(255,255,255,0.06); color: white; }
    .nav-item.active { background: var(--primary); color: white; }
    .nav-item .material-icons-outlined { font-size: 20px; }

    .sidebar-footer {
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 12px;
    }
    .logout { color: #F87171; }
    .logout:hover { background: rgba(248,113,113,0.1); }

    .admin-main {
      margin-left: var(--sidebar-width);
      padding: 32px;
      background: var(--bg-grey);
      min-height: 100vh;
    }

    @media (max-width: 768px) {
      .admin-layout { grid-template-columns: 1fr; }
      .admin-sidebar { display: none; }
      .admin-main { margin-left: 0; padding: 16px; }
    }
  `]
})
export class AdminLayoutComponent {
  constructor(public auth: AuthService) {}
}
