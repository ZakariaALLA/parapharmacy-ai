import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card" [class.out-of-stock]="product.stockQuantity === 0">
      <a [routerLink]="['/produit', product.slug]" class="card-image-link">
        <div class="card-image">
          <img [src]="primaryImage" [alt]="product.title" loading="lazy" />
          @if (product.stockQuantity === 0) {
            <div class="stock-overlay">Rupture de stock</div>
          }
          @if (product.stockQuantity > 0 && product.stockQuantity <= 10) {
            <span class="low-stock-badge">Plus que {{ product.stockQuantity }} en stock</span>
          }
        </div>
      </a>

      <div class="card-body">
        <span class="card-category">{{ product.categoryName }}</span>
        <a [routerLink]="['/produit', product.slug]" class="card-title">{{ product.title }}</a>
        <span class="card-manufacturer">{{ product.manufacturer }}</span>

        <div class="card-rating">
          @for (star of stars; track star) {
            <span class="material-icons star" [class.filled]="star <= product.rating">
              {{ star <= product.rating ? 'star' : (star - 0.5 <= product.rating ? 'star_half' : 'star_border') }}
            </span>
          }
          <span class="rating-value">{{ product.rating | number:'1.1-1' }}</span>
        </div>

        <div class="card-footer">
          <span class="card-price">{{ product.price | number:'1.2-2' }} <small>MAD</small></span>
          <button
            class="add-to-cart-btn"
            [disabled]="product.stockQuantity === 0"
            (click)="onAddToCart($event)"
            [class.added]="isInCart"
          >
            <span class="material-icons-outlined">
              {{ isInCart ? 'check' : 'add_shopping_cart' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--grey-100);
      transition: all var(--transition-base);
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--grey-200);
    }
    .product-card.out-of-stock { opacity: 0.7; }

    .card-image-link { display: block; }
    .card-image {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--bg-light);
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .product-card:hover .card-image img {
      transform: scale(1.05);
    }

    .stock-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.5);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
    }
    .low-stock-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: var(--warning);
      color: white;
      padding: 4px 10px;
      border-radius: var(--radius-full);
      font-size: 10px;
      font-weight: 600;
    }

    .card-body {
      padding: 14px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-category {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--primary);
      margin-bottom: 6px;
    }
    .card-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--grey-800);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 4px;
      transition: color var(--transition-fast);
    }
    .card-title:hover { color: var(--primary-dark); }
    .card-manufacturer {
      font-size: 11px;
      color: var(--grey-400);
      margin-bottom: 8px;
    }

    .card-rating {
      display: flex;
      align-items: center;
      gap: 1px;
      margin-bottom: 12px;
    }
    .star {
      font-size: 14px;
      color: var(--grey-300);
    }
    .star.filled { color: #FBBF24; }
    .rating-value {
      font-size: 11px;
      color: var(--grey-500);
      margin-left: 4px;
      font-weight: 500;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid var(--grey-100);
    }
    .card-price {
      font-size: 18px;
      font-weight: 800;
      color: var(--grey-900);
    }
    .card-price small {
      font-size: 11px;
      font-weight: 500;
      color: var(--grey-500);
    }

    .add-to-cart-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--primary);
      background: transparent;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
      flex-shrink: 0;
    }
    .add-to-cart-btn:hover:not(:disabled) {
      background: var(--primary);
      color: white;
      transform: scale(1.1);
    }
    .add-to-cart-btn.added {
      background: var(--primary);
      color: white;
    }
    .add-to-cart-btn:disabled {
      border-color: var(--grey-300);
      color: var(--grey-300);
      cursor: not-allowed;
    }
    .add-to-cart-btn .material-icons-outlined { font-size: 18px; }
  `]
})
export class ProductCardComponent {
  @Input() product: any;
  stars = [1, 2, 3, 4, 5];

  get primaryImage(): string {
    const primary = this.product.images?.find((img: any) => img.isPrimary);
    return primary?.imageUrl || this.product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400';
  }

  get isInCart(): boolean {
    return this.cartService.isInCart(this.product.id);
  }

  constructor(private cartService: CartService) {}

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(this.product);
  }
}
