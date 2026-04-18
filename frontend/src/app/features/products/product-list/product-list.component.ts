import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductService, Product, Category, ProductFilter, ProductPage } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  manufacturers: string[] = [];
  loading = true;
  filtersOpen = false;

  filter: ProductFilter = { page: 0, size: 12 };
  sortValue = 'createdAt-desc';
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe(cats => this.categories = cats);
    this.productService.getManufacturers().subscribe(m => this.manufacturers = m);

    this.route.queryParams.subscribe(params => {
      if (params['keyword']) this.filter.keyword = params['keyword'];
      if (params['categoryId']) this.filter.categoryId = +params['categoryId'];
      if (params['sortBy']) {
        this.filter.sortBy = params['sortBy'];
        this.filter.sortDir = params['sortDir'] || 'desc';
        this.sortValue = `${this.filter.sortBy}-${this.filter.sortDir}`;
      }
      this.loadProducts();
    });
  }

  get pageTitle(): string {
    if (this.filter.keyword) return `Résultats pour "${this.filter.keyword}"`;
    const cat = this.categories.find(c => c.id === this.filter.categoryId);
    if (cat) return cat.name;
    return 'Tous les Produits';
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.filter).subscribe({
      next: (page: ProductPage) => {
        this.products = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.currentPage = page.number;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilters(): void {
    this.filter.page = 0;
    this.filtersOpen = false;
    this.loadProducts();
  }

  resetFilters(): void {
    this.filter = { page: 0, size: 12 };
    this.sortValue = 'createdAt-desc';
    this.filtersOpen = false;
    this.loadProducts();
  }

  onSortChange(): void {
    const [sortBy, sortDir] = this.sortValue.split('-');
    this.filter.sortBy = sortBy;
    this.filter.sortDir = sortDir;
    this.filter.page = 0;
    this.loadProducts();
  }

  goToPage(page: number): void {
    this.filter.page = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
