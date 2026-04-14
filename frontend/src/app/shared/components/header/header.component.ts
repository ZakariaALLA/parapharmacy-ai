import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header" [class.scrolled]="isScrolled()">
      <div class="header-inner container">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <span class="logo-icon">💊</span>
          <div class="logo-text">
            <span class="logo-name">ParaPharma</span>
            <span class="logo-country">Maroc</span>
          </div>
        </a>

        <!-- Search -->
        <div class="search-bar">
          <span class="material-icons-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Rechercher un produit, une marque..."
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            id="header-search"
          />
          @if (searchQuery) {
            <button class="search-clear" (click)="searchQuery = ''">
              <span class="material-icons">close</span>
            </button>
          }
        </div>

        <!-- Actions -->
        <div class="header-actions">
          @if (auth.isAuthenticated()) {
            <div class="user-menu" (click)="showUserMenu = !showUserMenu">
              <span class="material-icons-outlined">person</span>
              <span class="user-name">{{ auth.user()?.fullName }}</span>
              @if (showUserMenu) {
                <div class="dropdown-menu" id="user-dropdown">
                  @if (auth.isAdmin()) {
                    <a routerLink="/admin" class="dropdown-item" (click)="showUserMenu = false">
                      <span class="material-icons-outlined">dashboard</span>
                      Tableau de bord
                    </a>
                  }
                  <a routerLink="/liste-souhaits" class="dropdown-item" (click)="showUserMenu = false">
                    <span class="material-icons-outlined">favorite_border</span>
                    Liste de souhaits
                  </a>
                  <button class="dropdown-item" (click)="logout()">
                    <span class="material-icons-outlined">logout</span>
                    Déconnexion
                  </button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/connexion" class="header-btn" id="login-btn">
              <span class="material-icons-outlined">person_outline</span>
              <span class="btn-label">Connexion</span>
            </a>
          }

          <a routerLink="/liste-souhaits" class="header-btn" id="wishlist-btn">
            <span class="material-icons-outlined">favorite_border</span>
          </a>

          <a routerLink="/panier" class="header-btn cart-btn" id="cart-btn">
            <span class="material-icons-outlined">shopping_bag</span>
            @if (cart.itemCount() > 0) {
              <span class="cart-badge">{{ cart.itemCount() }}</span>
            }
          </a>

          <!-- Mobile menu toggle -->
          <button class="mobile-toggle" (click)="mobileMenuOpen = !mobileMenuOpen">
            <span class="material-icons">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>

      <!-- Nav -->
      <nav class="nav" [class.open]="mobileMenuOpen">
        <div class="container nav-inner">
          <a routerLink="/produits" routerLinkActive="active" (click)="mobileMenuOpen = false" class="nav-link">Tous les produits</a>
          <a routerLink="/produits" [queryParams]="{categoryId: 1}" routerLinkActive="active" (click)="mobileMenuOpen = false" class="nav-link">Dermo-Cosmétiques</a>
          <a routerLink="/produits" [queryParams]="{categoryId: 2}" routerLinkActive="active" (click)="mobileMenuOpen = false" class="nav-link">Compléments</a>
          <a routerLink="/produits" [queryParams]="{categoryId: 3}" routerLinkActive="active" (click)="mobileMenuOpen = false" class="nav-link">Hygiène</a>
          <a routerLink="/produits" [queryParams]="{categoryId: 4}" routerLinkActive="active" (click)="mobileMenuOpen = false" class="nav-link">Bébé</a>
          <a routerLink="/produits" [queryParams]="{categoryId: 5}" routerLinkActive="active" (click)="mobileMenuOpen = false" class="nav-link">Soins Peau</a>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--grey-200);
      transition: box-shadow var(--transition-base);
    }
    .header.scrolled {
      box-shadow: var(--shadow-md);
    }
    .header-inner {
      display: flex;
      align-items: center;
      height: var(--header-height);
      gap: 24px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .logo-icon { font-size: 28px; }
    .logo-text { display: flex; flex-direction: column; line-height: 1.1; }
    .logo-name { font-size: 18px; font-weight: 800; color: var(--grey-900); letter-spacing: -0.5px; }
    .logo-country { font-size: 11px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; }

    .search-bar {
      flex: 1;
      max-width: 520px;
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-bar input {
      width: 100%;
      padding: 10px 40px 10px 42px;
      border: 2px solid var(--grey-200);
      border-radius: var(--radius-full);
      font-size: 13px;
      transition: all var(--transition-base);
      background: var(--bg-light);
    }
    .search-bar input:focus {
      outline: none;
      border-color: var(--primary);
      background: var(--white);
      box-shadow: 0 0 0 4px var(--primary-50);
    }
    .search-icon {
      position: absolute;
      left: 14px;
      color: var(--grey-400);
      font-size: 20px;
    }
    .search-clear {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      color: var(--grey-400);
      padding: 4px;
      border-radius: 50%;
    }
    .search-clear:hover { color: var(--grey-600); }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .header-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
      color: var(--grey-700);
      transition: all var(--transition-fast);
    }
    .header-btn:hover {
      background: var(--primary-50);
      color: var(--primary-dark);
    }
    .btn-label { display: none; }

    .cart-btn {
      position: relative;
    }
    .cart-badge {
      position: absolute;
      top: 2px;
      right: 4px;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary);
      color: white;
      font-size: 10px;
      font-weight: 700;
      border-radius: 50%;
    }

    .user-menu {
      position: relative;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--grey-700);
    }
    .user-menu:hover { background: var(--primary-50); }
    .user-name {
      font-size: 13px;
      font-weight: 500;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--grey-200);
      padding: 6px;
      min-width: 200px;
      z-index: 100;
      animation: fadeInUp 0.2s ease;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      color: var(--grey-700);
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition: background var(--transition-fast);
    }
    .dropdown-item:hover {
      background: var(--primary-50);
      color: var(--primary-dark);
    }
    .dropdown-item .material-icons-outlined { font-size: 18px; }

    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--grey-700);
      padding: 8px;
    }

    .nav {
      background: var(--white);
      border-top: 1px solid var(--grey-100);
    }
    .nav-inner {
      display: flex;
      gap: 0;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .nav-inner::-webkit-scrollbar { display: none; }
    .nav-link {
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 500;
      color: var(--grey-600);
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      transition: all var(--transition-fast);
    }
    .nav-link:hover, .nav-link.active {
      color: var(--primary-dark);
      border-bottom-color: var(--primary);
    }

    @media (min-width: 768px) {
      .btn-label { display: inline; }
    }

    @media (max-width: 768px) {
      .search-bar { display: none; }
      .user-name { display: none; }
      .mobile-toggle { display: block; }
      .nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: var(--shadow-lg);
        padding: 8px 0;
      }
      .nav.open { display: block; }
      .nav-inner { flex-direction: column; }
      .nav-link {
        padding: 12px 20px;
        border-bottom: none;
        border-left: 3px solid transparent;
      }
      .nav-link:hover, .nav-link.active {
        border-left-color: var(--primary);
        background: var(--primary-50);
      }
    }
  `]
})
export class HeaderComponent {
  searchQuery = '';
  showUserMenu = false;
  mobileMenuOpen = false;
  isScrolled = signal(false);

  constructor(
    public auth: AuthService,
    public cart: CartService,
    private router: Router
  ) {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 10);
      });
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/produits'], {
        queryParams: { keyword: this.searchQuery.trim() }
      });
      this.mobileMenuOpen = false;
    }
  }

  logout(): void {
    this.showUserMenu = false;
    this.auth.logout();
  }
}
