import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  rating: number;
  description: string;
  usageTips: string;
  manufacturer: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  images: ProductImage[];
  stockQuantity: number;
  active: boolean;
  createdAt: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount?: number;
}

export interface ProductFilter {
  keyword?: string;
  categoryId?: number;
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sortBy?: string;
  sortDir?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private catUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getProducts(filter: ProductFilter = {}): Observable<ProductPage> {
    let params = new HttpParams();
    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString());
    if (filter.manufacturer) params = params.set('manufacturer', filter.manufacturer);
    if (filter.minPrice !== undefined) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice !== undefined) params = params.set('maxPrice', filter.maxPrice.toString());
    if (filter.minRating !== undefined) params = params.set('minRating', filter.minRating.toString());
    if (filter.inStock !== undefined) params = params.set('inStock', filter.inStock.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.sortDir) params = params.set('sortDir', filter.sortDir);
    params = params.set('page', (filter.page || 0).toString());
    params = params.set('size', (filter.size || 12).toString());

    return this.http.get<ProductPage>(this.apiUrl, { params });
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${slug}`);
  }

  searchProducts(query: string, page = 0, size = 12): Observable<ProductPage> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ProductPage>(`${this.apiUrl}/search`, { params });
  }

  getRelatedProducts(slug: string, limit = 4): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${slug}/related?limit=${limit}`);
  }

  getLatestProducts(page = 0, size = 8): Observable<ProductPage> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<ProductPage>(`${this.apiUrl}/latest`, { params });
  }

  getTopRatedProducts(page = 0, size = 8): Observable<ProductPage> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<ProductPage>(`${this.apiUrl}/top-rated`, { params });
  }

  getManufacturers(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/manufacturers`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.catUrl);
  }

  // Admin methods
  createProduct(product: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(productId: number, file: File, primary = false): Observable<Product> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Product>(`${this.apiUrl}/${productId}/images?primary=${primary}`, formData);
  }

  deleteImage(productId: number, imageId: number): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}/${productId}/images/${imageId}`);
  }
}
