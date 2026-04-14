import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-page container">
      <h1>Mon Panier</h1>

      @if (cart.items().length === 0) {
        <div class="empty-cart">
          <span class="material-icons-outlined" style="font-size:80px;color:var(--grey-300)">shopping_bag</span>
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos produits et ajoutez-les à votre panier</p>
          <a routerLink="/produits" class="btn-primary">Découvrir nos produits</a>
        </div>
      } @else {
        <div class="cart-layout">
          <div class="cart-items">
            @for (item of cart.items(); track item.productId) {
              <div class="cart-item">
                <a [routerLink]="['/produit', item.slug]" class="item-image">
                  <img [src]="item.imageUrl || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200'" [alt]="item.title">
                </a>
                <div class="item-details">
                  <a [routerLink]="['/produit', item.slug]" class="item-title">{{ item.title }}</a>
                  <span class="item-price">{{ item.price | number:'1.2-2' }} MAD</span>
                  <div class="item-actions">
                    <div class="qty-control">
                      <button (click)="updateQty(item, item.quantity - 1)" [disabled]="item.quantity <= 1">
                        <span class="material-icons">remove</span>
                      </button>
                      <span>{{ item.quantity }}</span>
                      <button (click)="updateQty(item, item.quantity + 1)" [disabled]="item.quantity >= item.stockQuantity">
                        <span class="material-icons">add</span>
                      </button>
                    </div>
                    <button class="remove-btn" (click)="cart.removeFromCart(item.productId)">
                      <span class="material-icons-outlined">delete_outline</span>
                      Supprimer
                    </button>
                  </div>
                </div>
                <div class="item-subtotal">
                  {{ item.price * item.quantity | number:'1.2-2' }} MAD
                </div>
              </div>
            }
          </div>

          <div class="cart-summary">
            <h3>Résumé</h3>
            <div class="summary-row">
              <span>Sous-total</span>
              <span>{{ cart.total() | number:'1.2-2' }} MAD</span>
            </div>
            <div class="summary-row">
              <span>Livraison</span>
              <span class="free-shipping">Gratuite</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ cart.total() | number:'1.2-2' }} MAD</span>
            </div>
            <a routerLink="/commander" class="btn-primary checkout-btn">
              <span class="material-icons-outlined">local_shipping</span>
              Commander (Paiement à la livraison)
            </a>
            <div class="cod-info">
              <span class="material-icons-outlined">info</span>
              <span>Paiement uniquement à la livraison (Cash On Delivery)</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-page { padding: 32px 16px; }
    .cart-page h1 { font-size: 28px; font-weight: 800; margin-bottom: 24px; }

    .empty-cart { text-align: center; padding: 80px 20px; }
    .empty-cart h2 { font-size: 22px; font-weight: 700; margin: 20px 0 8px; color: var(--grey-700); }
    .empty-cart p { color: var(--grey-500); margin-bottom: 24px; }

    .cart-layout { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }

    .cart-item {
      display: flex; gap: 16px; padding: 20px; background: white;
      border-radius: var(--radius-lg); border: 1px solid var(--grey-100);
      margin-bottom: 12px; transition: box-shadow var(--transition-fast);
    }
    .cart-item:hover { box-shadow: var(--shadow-sm); }
    .item-image { width: 100px; height: 100px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0; }
    .item-image img { width: 100%; height: 100%; object-fit: cover; }
    .item-details { flex: 1; }
    .item-title { font-size: 14px; font-weight: 600; color: var(--grey-800); display: block; margin-bottom: 4px; }
    .item-title:hover { color: var(--primary); }
    .item-price { font-size: 13px; color: var(--grey-500); }
    .item-actions { display: flex; align-items: center; gap: 16px; margin-top: 12px; }
    .qty-control {
      display: flex; align-items: center;
      border: 1px solid var(--grey-200); border-radius: var(--radius-sm); overflow: hidden;
    }
    .qty-control button {
      width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
      border: none; background: var(--bg-light); cursor: pointer;
    }
    .qty-control button:hover:not(:disabled) { background: var(--grey-200); }
    .qty-control button:disabled { opacity: 0.3; cursor: not-allowed; }
    .qty-control .material-icons { font-size: 16px; }
    .qty-control span { width: 40px; text-align: center; font-size: 13px; font-weight: 600; }

    .remove-btn {
      display: flex; align-items: center; gap: 4px;
      background: none; border: none; color: var(--grey-400); font-size: 12px; cursor: pointer;
    }
    .remove-btn:hover { color: var(--danger); }
    .remove-btn .material-icons-outlined { font-size: 16px; }

    .item-subtotal {
      font-size: 16px; font-weight: 700; color: var(--grey-900);
      white-space: nowrap; align-self: center;
    }

    .cart-summary {
      background: white; border-radius: var(--radius-lg); padding: 24px;
      border: 1px solid var(--grey-100); position: sticky; top: calc(var(--header-height) + 110px);
    }
    .cart-summary h3 { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
    .summary-row {
      display: flex; justify-content: space-between; padding: 10px 0;
      font-size: 14px; color: var(--grey-600);
    }
    .summary-row.total {
      border-top: 2px solid var(--grey-200); margin-top: 8px; padding-top: 16px;
      font-size: 18px; font-weight: 800; color: var(--grey-900);
    }
    .free-shipping { color: var(--success); font-weight: 600; }
    .checkout-btn { width: 100%; margin-top: 20px; padding: 14px; text-align: center; }
    .cod-info {
      display: flex; align-items: center; gap: 8px;
      margin-top: 12px; padding: 10px; background: var(--primary-50);
      border-radius: var(--radius-sm); font-size: 11px; color: var(--grey-600);
    }
    .cod-info .material-icons-outlined { font-size: 16px; color: var(--primary); }

    @media (max-width: 768px) {
      .cart-layout { grid-template-columns: 1fr; }
      .cart-item { flex-wrap: wrap; }
      .item-subtotal { width: 100%; text-align: right; }
    }
  `]
})
export class CartComponent {
  constructor(public cart: CartService) {}

  updateQty(item: CartItem, qty: number): void {
    this.cart.updateQuantity(item.productId, qty);
  }
}
