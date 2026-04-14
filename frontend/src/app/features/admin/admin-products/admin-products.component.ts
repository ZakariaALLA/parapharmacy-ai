import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, Category, ProductPage } from '../../../core/services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  showForm = false;
  editingId: number | null = null;
  saving = false;
  formError = '';
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  form = {
    title: '', price: 0, categoryId: null as number | null,
    manufacturer: '', description: '', usageTips: '',
    stockQuantity: 0, rating: 0, active: true
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.productService.getCategories().subscribe(cats => this.categories = cats);
  }

  loadProducts(): void {
    this.productService.getProducts({ page: this.currentPage, size: 20 }).subscribe((page: ProductPage) => {
      this.products = page.content;
      this.totalPages = page.totalPages;
      this.totalElements = page.totalElements;
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.formError = '';
    this.form = { title: '', price: 0, categoryId: null, manufacturer: '', description: '', usageTips: '', stockQuantity: 0, rating: 0, active: true };
  }

  editProduct(product: Product): void {
    this.editingId = product.id;
    this.form = {
      title: product.title, price: product.price, categoryId: product.categoryId,
      manufacturer: product.manufacturer, description: product.description,
      usageTips: product.usageTips, stockQuantity: product.stockQuantity,
      rating: product.rating, active: product.active
    };
    this.showForm = true;
  }

  saveProduct(): void {
    if (!this.form.title || !this.form.price || !this.form.categoryId) {
      this.formError = 'Le titre, le prix et la catégorie sont obligatoires.';
      return;
    }
    this.saving = true;
    this.formError = '';

    const obs = this.editingId
      ? this.productService.updateProduct(this.editingId, this.form)
      : this.productService.createProduct(this.form);

    obs.subscribe({
      next: () => { this.saving = false; this.showForm = false; this.loadProducts(); },
      error: (err) => { this.saving = false; this.formError = err.error?.error || 'Une erreur est survenue lors de l\'enregistrement.'; }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce produit ?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  getImage(product: Product): string {
    const primary = product.images?.find(img => img.isPrimary);
    return primary?.imageUrl || product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100';
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
}
