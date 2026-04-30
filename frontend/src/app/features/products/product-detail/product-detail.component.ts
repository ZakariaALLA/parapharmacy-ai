import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductService, Product, Review } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  selectedImage = '';
  quantity = 1;
  isWishlisted = false;

  reviews: Review[] = [];
  reviewRating = 5;
  reviewComment = '';
  submittingReview = false;
  reviewError = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    public auth: AuthService
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

        this.loadReviews(product.id);

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

  loadReviews(productId: number): void {
    this.productService.getProductReviews(productId).subscribe(
      res => this.reviews = res
    );
  }

  submitReview(): void {
    if (!this.product || !this.auth.isLoggedIn()) return;
    if (!this.reviewComment.trim()) {
      this.reviewError = 'Veuillez saisir un commentaire.';
      return;
    }

    this.submittingReview = true;
    this.reviewError = '';

    this.productService.addReview(this.product.id, this.reviewRating, this.reviewComment).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.reviewComment = '';
        this.reviewRating = 5;
        this.submittingReview = false;
        if (this.product) {
          // Re-fetch product to update average rating and review count
          this.productService.getProductBySlug(this.product.slug).subscribe(p => this.product = p);
        }
      },
      error: (err) => {
        this.submittingReview = false;
        this.reviewError = err.error || 'Une erreur est survenue lors de l\'envoi de votre avis.';
      }
    });
  }
}
