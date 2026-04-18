import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
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
