import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductService, Product } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    @if (product) {
      <div class="detail-page container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <a routerLink="/">Accueil</a>
          <span class="material-icons">chevron_right</span>
          <a routerLink="/produits">Produits</a>
          <span class="material-icons">chevron_right</span>
          <a [routerLink]="['/produits']" [queryParams]="{categoryId: product.categoryId}">{{ product.categoryName }}</a>
          <span class="material-icons">chevron_right</span>
          <span class="current">{{ product.title }}</span>
        </nav>

        <div class="product-layout">
          <!-- Images -->
          <div class="product-images">
            <div class="main-image">
              <img [src]="selectedImage" [alt]="product.title" />
            </div>
            @if (product.images.length > 1) {
              <div class="thumbnails">
                @for (img of product.images; track img.id) {
                  <button class="thumb" [class.active]="selectedImage === img.imageUrl" (click)="selectedImage = img.imageUrl">
                    <img [src]="img.imageUrl" [alt]="product.title" />
                  </button>
                }
              </div>
            }
          </div>

          <!-- Info -->
          <div class="product-info">
            <span class="product-category">{{ product.categoryName }}</span>
            <h1>{{ product.title }}</h1>
            <span class="product-manufacturer">Par {{ product.manufacturer }}</span>

            <div class="product-rating">
              @for (s of [1,2,3,4,5]; track s) {
                <span class="material-icons" [style.color]="s <= product.rating ? '#FBBF24' : '#D1D5DB'">star</span>
              }
              <span class="rating-text">{{ product.rating | number:'1.1-1' }} / 5</span>
            </div>

            <div class="product-price">
              {{ product.price | number:'1.2-2' }} <small>MAD</small>
            </div>

            <div class="stock-status" [class.in-stock]="product.stockQuantity > 0" [class.out]="product.stockQuantity === 0">
              <span class="material-icons">{{ product.stockQuantity > 0 ? 'check_circle' : 'cancel' }}</span>
              {{ product.stockQuantity > 0 ? 'En stock (' + product.stockQuantity + ' disponibles)' : 'Rupture de stock' }}
            </div>

            <!-- Quantity + Add to Cart -->
            <div class="product-actions">
              <div class="quantity-control">
                <button (click)="decreaseQty()" [disabled]="quantity <= 1">
                  <span class="material-icons">remove</span>
                </button>
                <span class="qty-value">{{ quantity }}</span>
                <button (click)="increaseQty()" [disabled]="quantity >= product.stockQuantity">
                  <span class="material-icons">add</span>
                </button>
              </div>
              <button class="btn-primary btn-add-cart" [disabled]="product.stockQuantity === 0" (click)="addToCart()">
                <span class="material-icons-outlined">shopping_bag</span>
                Ajouter au panier
              </button>
              <button class="btn-wishlist" (click)="toggleWishlist()" [class.active]="isWishlisted">
                <span class="material-icons">{{ isWishlisted ? 'favorite' : 'favorite_border' }}</span>
              </button>
            </div>

            <!-- Description -->
            <div class="product-section">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>

            @if (product.usageTips) {
              <div class="product-section">
                <h3>Conseils d'utilisation</h3>
                <p>{{ product.usageTips }}</p>
              </div>
            }

            <!-- COD Badge -->
            <div class="cod-badge">
              <span class="material-icons-outlined">local_shipping</span>
              <div>
                <strong>Paiement à la livraison</strong>
                <span>Livraison partout au Maroc</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        @if (relatedProducts.length > 0) {
          <section class="related-section">
            <h2>Produits similaires</h2>
            <div class="related-grid">
              @for (p of relatedProducts; track p.id) {
                <app-product-card [product]="p" />
              }
            </div>
          </section>
        }
      </div>
    }
  `,
  styles: [`
    .detail-page { padding: 24px 16px; }
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--grey-400);
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .breadcrumb a { color: var(--grey-500); }
    .breadcrumb a:hover { color: var(--primary); }
    .breadcrumb .material-icons { font-size: 14px; }
    .breadcrumb .current { color: var(--grey-700); font-weight: 500; }

    .product-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      margin-bottom: 60px;
    }

    .main-image {
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--bg-light);
      border: 1px solid var(--grey-100);
    }
    .main-image img { width: 100%; aspect-ratio: 1; object-fit: cover; }
    .thumbnails {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    .thumb {
      width: 64px; height: 64px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      border: 2px solid var(--grey-200);
      cursor: pointer;
      padding: 0; background: none;
      transition: border-color var(--transition-fast);
    }
    .thumb.active, .thumb:hover { border-color: var(--primary); }
    .thumb img { width: 100%; height: 100%; object-fit: cover; }

    .product-info { padding-top: 8px; }
    .product-category {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--primary);
    }
    .product-info h1 {
      font-size: 28px;
      font-weight: 800;
      color: var(--grey-900);
      margin: 8px 0 4px;
      line-height: 1.3;
    }
    .product-manufacturer {
      font-size: 14px;
      color: var(--grey-500);
    }
    .product-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 16px 0;
    }
    .product-rating .material-icons { font-size: 20px; }
    .rating-text { font-size: 13px; color: var(--grey-500); margin-left: 8px; }

    .product-price {
      font-size: 32px;
      font-weight: 800;
      color: var(--grey-900);
      margin-bottom: 12px;
    }
    .product-price small { font-size: 16px; font-weight: 500; color: var(--grey-500); }

    .stock-status {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .stock-status.in-stock { background: #d1fae5; color: #065f46; }
    .stock-status.out { background: #fee2e2; color: #991b1b; }
    .stock-status .material-icons { font-size: 18px; }

    .product-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 24px;
    }
    .quantity-control {
      display: flex;
      align-items: center;
      border: 1px solid var(--grey-200);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .quantity-control button {
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      border: none; background: var(--bg-light);
      color: var(--grey-700);
      transition: background var(--transition-fast);
    }
    .quantity-control button:hover:not(:disabled) { background: var(--grey-200); }
    .quantity-control button:disabled { opacity: 0.3; cursor: not-allowed; }
    .quantity-control .material-icons { font-size: 18px; }
    .qty-value {
      width: 48px;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
    }

    .btn-add-cart {
      flex: 1;
      padding: 12px 24px;
    }
    .btn-wishlist {
      width: 44px; height: 44px;
      border-radius: 50%;
      border: 2px solid var(--grey-200);
      background: white;
      color: var(--grey-400);
      display: flex; align-items: center; justify-content: center;
      transition: all var(--transition-base);
      flex-shrink: 0;
    }
    .btn-wishlist:hover, .btn-wishlist.active {
      border-color: #EF4444;
      color: #EF4444;
    }
    .btn-wishlist.active { background: #FEE2E2; }

    .product-section {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--grey-100);
    }
    .product-section h3 {
      font-size: 14px;
      font-weight: 700;
      color: var(--grey-900);
      margin-bottom: 8px;
    }
    .product-section p {
      font-size: 14px;
      line-height: 1.7;
      color: var(--grey-600);
    }

    .cod-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--primary-50);
      border-radius: var(--radius-md);
      border: 1px solid var(--primary-100);
    }
    .cod-badge .material-icons-outlined { font-size: 28px; color: var(--primary); }
    .cod-badge strong { display: block; font-size: 14px; color: var(--grey-900); }
    .cod-badge span { font-size: 12px; color: var(--grey-500); }

    .related-section { margin-bottom: 40px; }
    .related-section h2 {
      font-size: 24px;
      font-weight: 800;
      color: var(--grey-900);
      margin-bottom: 24px;
    }
    .related-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    @media (max-width: 768px) {
      .product-layout { grid-template-columns: 1fr; gap: 24px; }
      .product-info h1 { font-size: 22px; }
      .product-price { font-size: 24px; }
      .product-actions { flex-wrap: wrap; }
      .btn-add-cart { order: -1; width: 100%; }
      .related-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  selectedImage = '';
  quantity = 1;
  isWishlisted = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.productService.getProductBySlug(slug).subscribe(product => {
        this.product = product;
        const primary = product.images?.find(img => img.isPrimary);
        this.selectedImage = primary?.imageUrl || product.images?.[0]?.imageUrl || '';
        this.quantity = 1;

        this.productService.getRelatedProducts(slug).subscribe(
          related => this.relatedProducts = related
        );

        if (this.auth.isLoggedIn()) {
          this.isWishlisted = this.wishlistService.isInWishlist(product.id);
        }
      });
    });
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stockQuantity) this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    if (!this.product) return;
    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(this.product);
    }
  }

  toggleWishlist(): void {
    if (!this.auth.isLoggedIn() || !this.product) return;
    if (this.isWishlisted) {
      this.wishlistService.removeFromWishlist(this.product.id).subscribe(() => this.isWishlisted = false);
    } else {
      this.wishlistService.addToWishlist(this.product.id).subscribe(() => this.isWishlisted = true);
    }
  }
}
