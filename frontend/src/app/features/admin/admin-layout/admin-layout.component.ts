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
      background: #f8fafc; /* Very light modern background for contrast */
    }

    .admin-sidebar {
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      color: white;
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--sidebar-width);
      z-index: 1001;
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.05); /* Soft shadow on the right */
      overflow-y: auto;
    }

    /* Scrollbar for sidebar */
    .admin-sidebar::-webkit-scrollbar { width: 4px; }
    .admin-sidebar::-webkit-scrollbar-track { background: transparent; }
    .admin-sidebar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      margin-bottom: 32px;
    }
    
    .sidebar-brand .logo-icon { 
      font-size: 28px;
      background: linear-gradient(135deg, var(--primary-300), var(--primary-600));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 8px rgba(126, 217, 87, 0.4));
    }
    
    .brand-name { 
      display: block; 
      font-size: 18px; 
      font-weight: 800; 
      letter-spacing: -0.5px;
      color: #f1f5f9;
    }
    
    .brand-sub { 
      display: block; 
      font-size: 11px; 
      color: var(--primary-400); 
      text-transform: uppercase; 
      letter-spacing: 2px;
      font-weight: 600;
      margin-top: 2px;
    }

    .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      border-radius: var(--radius-lg);
      font-size: 14px;
      font-weight: 500;
      color: #94a3b8;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      border: 1px solid transparent; /* Prepare for hover border */
      background: transparent;
      width: 100%;
      cursor: pointer;
      text-align: left;
      position: relative;
      overflow: hidden;
    }
    
    .nav-item::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;
    }

    .nav-item:hover { 
      color: white; 
      transform: translateX(4px);
    }
    
    .nav-item:hover::before {
      opacity: 1;
    }
    
    .nav-item.active { 
      background: var(--primary); 
      color: white;
      box-shadow: 0 8px 16px -4px rgba(126, 217, 87, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .nav-item .material-icons-outlined { 
      font-size: 22px; 
      position: relative;
      z-index: 2;
      transition: transform 0.3s ease;
    }
    
    .nav-item:hover .material-icons-outlined {
      transform: scale(1.1);
    }
    
    /* Ensure text is above effect */
    .nav-item span:not(.material-icons-outlined),
    .nav-item {
      position: relative;
      z-index: 2;
    }

    .sidebar-footer {
      border-top: 1px solid rgba(255,255,255,0.06);
      padding-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .logout { 
      color: #f87171; 
      margin-top: 8px;
    }
    
    .logout:hover { 
      background: rgba(248,113,113,0.1); 
      color: #fca5a5;
      border-color: rgba(248,113,113,0.2);
    }

    .admin-main {
      margin-left: var(--sidebar-width);
      padding: 40px;
      /* Subtle radial gradient to make standard content area look deep */
      background: radial-gradient(circle at top right, #ffffff, #f8fafc);
      min-height: 100vh;
    }

    @media (max-width: 1024px) {
      .admin-main { padding: 24px; }
    }

    @media (max-width: 768px) {
      .admin-layout { grid-template-columns: 1fr; }
      .admin-sidebar { display: none; }
      .admin-main { margin-left: 0; padding: 16px; }
    }
  `]
})
export class AdminLayoutComponent {
  constructor(public auth: AuthService) { }
}
