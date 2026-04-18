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
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
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
