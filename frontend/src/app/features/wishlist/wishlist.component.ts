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
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
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
