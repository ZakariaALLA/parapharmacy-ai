import { Component, signal, HostListener, ElementRef } from '@angular/core';
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
    private router: Router,
    private eRef: ElementRef
  ) {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 10);
      });
    }

    // Close menus on navigation
    this.router.events.subscribe(() => {
      this.showUserMenu = false;
      this.mobileMenuOpen = false;
    });
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

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showUserMenu = false;
    }
  }
}
