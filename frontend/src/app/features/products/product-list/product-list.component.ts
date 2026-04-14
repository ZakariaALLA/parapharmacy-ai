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
  template: `
    <div class="catalog-page">
      <div class="container">
        <div class="catalog-header">
          <h1>{{ pageTitle }}</h1>
          <p>{{ totalElements }} produit{{ totalElements > 1 ? 's' : '' }} trouvé{{ totalElements > 1 ? 's' : '' }}</p>
        </div>

        <div class="catalog-layout">
          <!-- Filters Sidebar -->
          <aside class="filters-sidebar" [class.open]="filtersOpen">
            <div class="filters-header">
              <h3>Filtres</h3>
              <button class="filters-close" (click)="filtersOpen = false">
                <span class="material-icons">close</span>
              </button>
            </div>

            <!-- Category Filter -->
            <div class="filter-group">
              <h4>Catégorie</h4>
              @for (cat of categories; track cat.id) {
                <label class="filter-option">
                  <input type="radio" name="category" [value]="cat.id"
                    [checked]="filter.categoryId === cat.id"
                    (change)="filter.categoryId = cat.id; applyFilters()">
                  <span>{{ cat.name }}</span>
                </label>
              }
              @if (filter.categoryId) {
                <button class="clear-filter" (click)="filter.categoryId = undefined; applyFilters()">
                  Toutes les catégories
                </button>
              }
            </div>

            <!-- Price Filter -->
            <div class="filter-group">
              <h4>Prix (MAD)</h4>
              <div class="price-inputs">
                <input type="number" placeholder="Min" [(ngModel)]="filter.minPrice" (change)="applyFilters()">
                <span>—</span>
                <input type="number" placeholder="Max" [(ngModel)]="filter.maxPrice" (change)="applyFilters()">
              </div>
            </div>

            <!-- Rating Filter -->
            <div class="filter-group">
              <h4>Note minimum</h4>
              @for (r of [4,3,2,1]; track r) {
                <label class="filter-option">
                  <input type="radio" name="rating" [value]="r"
                    [checked]="filter.minRating === r"
                    (change)="filter.minRating = r; applyFilters()">
                  <span class="rating-label">
                    @for (s of [1,2,3,4,5]; track s) {
                      <span class="material-icons" [style.color]="s <= r ? '#FBBF24' : '#D1D5DB'" style="font-size:16px">star</span>
                    }
                    & plus
                  </span>
                </label>
              }
              @if (filter.minRating) {
                <button class="clear-filter" (click)="filter.minRating = undefined; applyFilters()">Toutes les notes</button>
              }
            </div>

            <!-- Manufacturer Filter -->
            <div class="filter-group">
              <h4>Marque</h4>
              <select [(ngModel)]="filter.manufacturer" (change)="applyFilters()" class="filter-select">
                <option [ngValue]="undefined">Toutes les marques</option>
                @for (m of manufacturers; track m) {
                  <option [value]="m">{{ m }}</option>
                }
              </select>
            </div>

            <!-- Availability Filter -->
            <div class="filter-group">
              <label class="filter-option">
                <input type="checkbox" [(ngModel)]="filter.inStock" (change)="applyFilters()">
                <span>En stock uniquement</span>
              </label>
            </div>

            <button class="btn-outline" style="width:100%" (click)="resetFilters()">
              Réinitialiser les filtres
            </button>
          </aside>

          <!-- Products Grid -->
          <div class="catalog-main">
            <div class="catalog-toolbar">
              <button class="filter-toggle" (click)="filtersOpen = true">
                <span class="material-icons-outlined">tune</span> Filtres
              </button>
              <div class="sort-control">
                <label>Trier par :</label>
                <select [(ngModel)]="sortValue" (change)="onSortChange()">
                  <option value="createdAt-desc">Plus récents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating-desc">Mieux notés</option>
                  <option value="title-asc">Nom A-Z</option>
                </select>
              </div>
            </div>

            @if (loading) {
              <div class="loading-grid">
                @for (i of [1,2,3,4,5,6,7,8]; track i) {
                  <div class="skeleton-card">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-body">
                      <div class="skeleton-line short"></div>
                      <div class="skeleton-line"></div>
                      <div class="skeleton-line medium"></div>
                    </div>
                  </div>
                }
              </div>
            } @else if (products.length === 0) {
              <div class="empty-state">
                <span class="material-icons-outlined" style="font-size:64px;color:var(--grey-300)">search_off</span>
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos filtres ou votre recherche</p>
                <button class="btn-primary" (click)="resetFilters()">Réinitialiser</button>
              </div>
            } @else {
              <div class="products-grid">
                @for (product of products; track product.id) {
                  <app-product-card [product]="product" />
                }
              </div>

              <!-- Pagination -->
              @if (totalPages > 1) {
                <div class="pagination">
                  <button class="page-btn" [disabled]="currentPage === 0" (click)="goToPage(currentPage - 1)">
                    <span class="material-icons">chevron_left</span>
                  </button>
                  @for (p of pageNumbers; track p) {
                    <button class="page-btn" [class.active]="p === currentPage" (click)="goToPage(p)">
                      {{ p + 1 }}
                    </button>
                  }
                  <button class="page-btn" [disabled]="currentPage === totalPages - 1" (click)="goToPage(currentPage + 1)">
                    <span class="material-icons">chevron_right</span>
                  </button>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .catalog-page { padding: 32px 0; }
    .catalog-header {
      margin-bottom: 24px;
    }
    .catalog-header h1 { font-size: 28px; font-weight: 800; color: var(--grey-900); }
    .catalog-header p { color: var(--grey-500); font-size: 14px; margin-top: 4px; }

    .catalog-layout { display: grid; grid-template-columns: 260px 1fr; gap: 32px; }

    /* Filters */
    .filters-sidebar {
      background: white;
      border-radius: var(--radius-lg);
      padding: 20px;
      border: 1px solid var(--grey-100);
      height: fit-content;
      position: sticky;
      top: calc(var(--header-height) + 110px);
    }
    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .filters-header h3 { font-size: 16px; font-weight: 700; }
    .filters-close { display: none; background: none; border: none; color: var(--grey-500); }

    .filter-group {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--grey-100);
    }
    .filter-group h4 {
      font-size: 13px;
      font-weight: 700;
      color: var(--grey-800);
      margin-bottom: 10px;
    }
    .filter-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      font-size: 13px;
      color: var(--grey-600);
      cursor: pointer;
    }
    .filter-option input[type="radio"],
    .filter-option input[type="checkbox"] {
      accent-color: var(--primary);
    }
    .rating-label { display: flex; align-items: center; gap: 2px; }
    .clear-filter {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 4px;
      padding: 0;
    }
    .price-inputs {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .price-inputs input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--grey-200);
      border-radius: var(--radius-sm);
      font-size: 13px;
    }
    .price-inputs input:focus { outline: none; border-color: var(--primary); }
    .filter-select {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--grey-200);
      border-radius: var(--radius-sm);
      font-size: 13px;
      background: white;
    }

    /* Toolbar */
    .catalog-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .filter-toggle {
      display: none;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: white;
      border: 1px solid var(--grey-200);
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
    }
    .sort-control {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }
    .sort-control label { font-size: 13px; color: var(--grey-500); white-space: nowrap; }
    .sort-control select {
      padding: 8px 12px;
      border: 1px solid var(--grey-200);
      border-radius: var(--radius-md);
      font-size: 13px;
      background: white;
    }

    /* Product Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    /* Loading Skeleton */
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .skeleton-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--grey-100);
    }
    .skeleton-image {
      aspect-ratio: 1;
      background: linear-gradient(90deg, var(--grey-100) 25%, var(--grey-200) 50%, var(--grey-100) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .skeleton-body { padding: 14px; }
    .skeleton-line {
      height: 12px;
      background: var(--grey-100);
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .skeleton-line.short { width: 40%; }
    .skeleton-line.medium { width: 60%; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    .empty-state h3 { font-size: 20px; font-weight: 700; margin: 16px 0 8px; color: var(--grey-700); }
    .empty-state p { color: var(--grey-500); margin-bottom: 20px; }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      margin-top: 40px;
    }
    .page-btn {
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid var(--grey-200);
      background: white;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 600;
      color: var(--grey-700);
      transition: all var(--transition-fast);
    }
    .page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
    .page-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    @media (max-width: 1024px) {
      .products-grid, .loading-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .catalog-layout { grid-template-columns: 1fr; }
      .filters-sidebar {
        display: none;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 1001;
        border-radius: 0;
        overflow-y: auto;
        padding: 20px;
      }
      .filters-sidebar.open { display: block; }
      .filters-close { display: block; }
      .filter-toggle { display: flex; }
      .products-grid, .loading-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    }
  `]
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
