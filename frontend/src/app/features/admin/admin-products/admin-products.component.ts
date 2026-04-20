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

  // Image management
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploading = false;
  currentProductImages: any[] = [];

  constructor(private productService: ProductService) { }

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
    this.selectedFile = null;
    this.imagePreview = null;
    this.currentProductImages = [];
    this.form = { title: '', price: 0, categoryId: null, manufacturer: '', description: '', usageTips: '', stockQuantity: 0, rating: 0, active: true };
  }

  editProduct(product: Product): void {
    this.editingId = product.id;
    this.currentProductImages = [...(product.images || [])];
    this.imagePreview = null;
    this.selectedFile = null;
    this.form = {
      title: product.title, price: product.price, categoryId: product.categoryId,
      manufacturer: product.manufacturer, description: product.description,
      usageTips: product.usageTips, stockQuantity: product.stockQuantity,
      rating: product.rating, active: product.active
    };
    this.showForm = true;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  uploadImage(): void {
    if (!this.selectedFile || !this.editingId) return;

    this.uploading = true;
    this.productService.uploadImage(this.editingId, this.selectedFile, this.currentProductImages.length === 0)
      .subscribe({
        next: (updatedProduct) => {
          this.currentProductImages = updatedProduct.images;
          this.selectedFile = null;
          this.imagePreview = null;
          this.uploading = false;
          this.loadProducts();
        },
        error: (err) => {
          this.uploading = false;
          console.error('Image upload failed:', err);
          alert(`Échec de l'upload: ${err.error?.error || 'Erreur serveur'}\nConsultez la console pour plus de détails.`);
        }
      });
  }

  deleteImage(imageId: number): void {
    if (!this.editingId) return;

    this.productService.deleteImage(this.editingId, imageId).subscribe((updatedProduct) => {
      this.currentProductImages = updatedProduct.images;
      this.loadProducts();
    });
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
      next: (product: Product) => {
        // If we have a selected file and we are in creation mode
        if (this.selectedFile && !this.editingId) {
          this.productService.uploadImage(product.id, this.selectedFile, true).subscribe({
            next: () => this.finalizeSave(),
            error: (err) => {
              this.saving = false;
              console.error('Post-creation upload failed:', err);
              this.formError = 'Produit créé mais erreur lors de l\'upload de l\'image: ' + (err.error?.error || 'Erreur inconnue');
              alert(this.formError);
            }
          });
        } else {
          this.finalizeSave();
        }
      },
      error: (err) => {
        this.saving = false;
        console.error('Error saving product:', err);
        this.formError = err.error?.error || `Une erreur est survenue (Code: ${err.status}). Veuillez réessayer.`;
        alert(`Erreur d'enregistrement: ${this.formError}`);
      }
    });
  }

  private finalizeSave(): void {
    this.saving = false;
    this.showForm = false;
    this.loadProducts();
    this.resetForm();
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
