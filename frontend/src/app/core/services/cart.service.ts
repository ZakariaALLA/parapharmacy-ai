import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  productId: number;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stockQuantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = signal<CartItem[]>(this.loadCart());

  items = this.cartItems.asReadonly();
  itemCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  total = computed(() => this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0));

  addToCart(product: any): void {
    const items = [...this.cartItems()];
    const existing = items.find(i => i.productId === product.id);

    if (existing) {
      if (existing.quantity < existing.stockQuantity) {
        existing.quantity++;
      }
    } else {
      const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
      items.push({
        productId: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        quantity: 1,
        imageUrl: primaryImage?.imageUrl || '',
        stockQuantity: product.stockQuantity
      });
    }

    this.cartItems.set(items);
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    const items = this.cartItems().filter(i => i.productId !== productId);
    this.cartItems.set(items);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const items = [...this.cartItems()];
    const item = items.find(i => i.productId === productId);
    if (item && quantity > 0 && quantity <= item.stockQuantity) {
      item.quantity = quantity;
      this.cartItems.set(items);
      this.saveCart();
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveCart();
  }

  isInCart(productId: number): boolean {
    return this.cartItems().some(i => i.productId === productId);
  }

  private saveCart(): void {
    localStorage.setItem('pp_cart', JSON.stringify(this.cartItems()));
  }

  private loadCart(): CartItem[] {
    try {
      const stored = localStorage.getItem('pp_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
