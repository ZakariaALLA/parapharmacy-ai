import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductService, Product, Category } from '../../core/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  latestProducts: Product[] = [];
  topRatedProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe(cats => this.categories = cats);
    this.productService.getLatestProducts(0, 8).subscribe(page => this.latestProducts = page.content);
    this.productService.getTopRatedProducts(0, 4).subscribe(page => this.topRatedProducts = page.content);
  }

  getCategoryIcon(name: string): string {
    const icons: Record<string, string> = {
      'Dermo-Cosmétiques': '🧴',
      'Compléments Alimentaires': '💊',
      'Hygiène': '🧼',
      'Soins Bébé': '👶',
      'Soins de la Peau': '✨'
    };
    return icons[name] || '🏥';
  }
}
