import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/services/product.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="wishlist-page container">
      <h1>Ma Liste de Souhaits</h1>
      @if (wishlist.items().length === 0) {
        <div class="empty">
          <span class="material-icons-outlined" style="font-size:80px;color:var(--grey-300)">favorite_border</span>
          <h2>Votre liste est vide</h2>
          <p>Ajoutez des produits à votre liste de souhaits pour les retrouver facilement</p>
          <a routerLink="/produits" class="btn-primary">Découvrir nos produits</a>
        </div>
      } @else {
        <div class="wishlist-grid">
          @for (product of wishlist.items(); track product.id) {
            <div class="wishlist-item">
              <app-product-card [product]="product" />
              <button class="remove-btn" (click)="remove(product.id)">
                <span class="material-icons">close</span> Retirer
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .wishlist-page { padding: 32px 16px; }
    .wishlist-page h1 { font-size: 28px; font-weight: 800; margin-bottom: 24px; }
    .empty { text-align: center; padding: 80px 20px; }
    .empty h2 { font-size: 22px; font-weight: 700; margin: 20px 0 8px; color: var(--grey-700); }
    .empty p { color: var(--grey-500); margin-bottom: 24px; }
    .wishlist-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .wishlist-item { position: relative; }
    .remove-btn {
      display: flex; align-items: center; justify-content: center; gap: 4px;
      width: 100%; margin-top: 8px; padding: 8px;
      background: white; border: 1px solid var(--grey-200); border-radius: var(--radius-md);
      font-size: 12px; color: var(--grey-500); cursor: pointer;
      transition: all var(--transition-fast);
    }
    .remove-btn:hover { border-color: var(--danger); color: var(--danger); }
    .remove-btn .material-icons { font-size: 14px; }
    @media (max-width: 768px) { .wishlist-grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class WishlistComponent implements OnInit {
  constructor(public wishlist: WishlistService) {}

  ngOnInit(): void {
    this.wishlist.loadWishlist();
  }

  remove(productId: number): void {
    this.wishlist.removeFromWishlist(productId).subscribe();
  }
}
