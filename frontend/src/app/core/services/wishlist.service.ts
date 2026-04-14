import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from './product.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;
  private wishlistItems = signal<Product[]>([]);

  items = this.wishlistItems.asReadonly();

  constructor(private http: HttpClient) {}

  loadWishlist(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (items) => this.wishlistItems.set(items),
      error: () => this.wishlistItems.set([])
    });
  }

  addToWishlist(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}`, {}).pipe(
      tap(() => this.loadWishlist())
    );
  }

  removeFromWishlist(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`).pipe(
      tap(() => {
        const items = this.wishlistItems().filter(p => p.id !== productId);
        this.wishlistItems.set(items);
      })
    );
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems().some(p => p.id === productId);
  }
}
