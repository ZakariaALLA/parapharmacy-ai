import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductService, Product, Category } from '../../core/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <!-- Hero Banner -->
    <section class="hero">
      <div class="container hero-content">
        <div class="hero-text animate-fade-in-up">
          <span class="hero-badge">🇲🇦 Livraison partout au Maroc</span>
          <h1>Votre Parapharmacie <br/><span class="highlight">en Ligne</span></h1>
          <p>Découvrez notre sélection de produits dermo-cosmétiques, compléments alimentaires et soins de qualité pharmaceutique à prix compétitifs.</p>
          <div class="hero-actions">
            <a routerLink="/produits" class="btn-primary btn-lg">
              <span class="material-icons-outlined">storefront</span>
              Découvrir nos produits
            </a>
          </div>
          <div class="hero-features">
            <div class="hero-feature">
              <span class="material-icons-outlined">verified</span>
              <span>100% Authentique</span>
            </div>
            <div class="hero-feature">
              <span class="material-icons-outlined">local_shipping</span>
              <span>Livraison rapide</span>
            </div>
            <div class="hero-feature">
              <span class="material-icons-outlined">payments</span>
              <span>Paiement à la livraison</span>
            </div>
          </div>
        </div>
        <div class="hero-visual animate-fade-in">
          <div class="hero-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Nos Catégories</h2>
          <p>Explorez notre gamme complète de produits parapharmaceutiques</p>
        </div>
        <div class="categories-grid">
          @for (cat of categories; track cat.id) {
            <a [routerLink]="['/produits']" [queryParams]="{categoryId: cat.id}" class="category-card">
              <div class="category-icon">{{ getCategoryIcon(cat.name) }}</div>
              <h3>{{ cat.name }}</h3>
              <span class="category-arrow material-icons">arrow_forward</span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Latest Products -->
    <section class="section bg-grey">
      <div class="container">
        <div class="section-header">
          <h2>Nouveautés</h2>
          <a routerLink="/produits" class="view-all">
            Voir tout <span class="material-icons">arrow_forward</span>
          </a>
        </div>
        <div class="products-grid">
          @for (product of latestProducts; track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      </div>
    </section>

    <!-- Trust Section -->
    <section class="section trust-section">
      <div class="container">
        <div class="trust-grid">
          <div class="trust-card">
            <div class="trust-icon">
              <span class="material-icons-outlined">local_pharmacy</span>
            </div>
            <h3>Qualité Pharmaceutique</h3>
            <p>Tous nos produits sont sélectionnés avec soin et proviennent de laboratoires certifiés.</p>
          </div>
          <div class="trust-card">
            <div class="trust-icon">
              <span class="material-icons-outlined">rocket_launch</span>
            </div>
            <h3>Livraison Rapide</h3>
            <p>Livraison partout au Maroc sous 24 à 72h. Suivi de commande en temps réel.</p>
          </div>
          <div class="trust-card">
            <div class="trust-icon">
              <span class="material-icons-outlined">payments</span>
            </div>
            <h3>Paiement à la Livraison</h3>
            <p>Payez uniquement à la réception de votre commande. Simple et sécurisé.</p>
          </div>
          <div class="trust-card">
            <div class="trust-icon">
              <span class="material-icons-outlined">support_agent</span>
            </div>
            <h3>Service Client</h3>
            <p>Notre équipe est à votre écoute pour vous accompagner dans vos choix.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Rated -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Les Mieux Notés</h2>
          <a routerLink="/produits" [queryParams]="{sortBy: 'rating', sortDir: 'desc'}" class="view-all">
            Voir tout <span class="material-icons">arrow_forward</span>
          </a>
        </div>
        <div class="products-grid">
          @for (product of topRatedProducts; track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Commandez maintenant, payez à la livraison</h2>
          <p>Profitez de nos prix compétitifs et recevez vos produits directement chez vous</p>
          <a routerLink="/produits" class="btn-primary btn-lg">
            Commander maintenant
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero */
    .hero {
      background: linear-gradient(135deg, #f0fbe8 0%, #e8f5e0 50%, #d5f4c0 100%);
      padding: 80px 0 60px;
      overflow: hidden;
      position: relative;
    }
    .hero-content {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 40px;
      align-items: center;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(126, 217, 87, 0.15);
      border-radius: var(--radius-full);
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-dark);
      margin-bottom: 20px;
    }
    .hero h1 {
      font-size: 48px;
      font-weight: 800;
      line-height: 1.1;
      color: var(--grey-900);
      margin-bottom: 20px;
      letter-spacing: -1px;
    }
    .hero .highlight {
      color: var(--primary);
      position: relative;
    }
    .hero p {
      font-size: 16px;
      line-height: 1.7;
      color: var(--grey-600);
      max-width: 480px;
      margin-bottom: 28px;
    }
    .btn-lg {
      padding: 14px 32px;
      font-size: 15px;
      border-radius: var(--radius-lg);
    }
    .hero-features {
      display: flex;
      gap: 24px;
      margin-top: 32px;
    }
    .hero-feature {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--grey-700);
    }
    .hero-feature .material-icons-outlined { font-size: 18px; color: var(--primary); }

    .hero-visual { position: relative; height: 400px; }
    .hero-shapes { position: relative; width: 100%; height: 100%; }
    .shape {
      position: absolute;
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }
    .shape-1 {
      width: 300px; height: 300px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
      top: 50px; right: 20px;
      opacity: 0.3;
    }
    .shape-2 {
      width: 200px; height: 200px;
      background: var(--primary-light);
      top: 0; right: 150px;
      opacity: 0.2;
      animation-delay: -2s;
    }
    .shape-3 {
      width: 150px; height: 150px;
      background: var(--primary);
      bottom: 40px; right: 80px;
      opacity: 0.15;
      animation-delay: -4s;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    /* Section Headers */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    .section-header h2 {
      font-size: 28px;
      font-weight: 800;
      color: var(--grey-900);
      letter-spacing: -0.5px;
    }
    .section-header p {
      font-size: 14px;
      color: var(--grey-500);
      margin-top: 4px;
    }
    .view-all {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary);
      transition: gap var(--transition-base);
    }
    .view-all:hover { gap: 8px; }
    .view-all .material-icons { font-size: 16px; }

    .bg-grey { background: var(--bg-grey); }

    /* Categories */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
    }
    .category-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 24px;
      text-align: center;
      border: 1px solid var(--grey-100);
      transition: all var(--transition-base);
      position: relative;
      overflow: hidden;
    }
    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }
    .category-icon {
      font-size: 40px;
      margin-bottom: 12px;
      display: block;
    }
    .category-card h3 {
      font-size: 13px;
      font-weight: 700;
      color: var(--grey-800);
    }
    .category-arrow {
      position: absolute;
      bottom: 8px;
      right: 8px;
      font-size: 16px;
      color: var(--primary);
      opacity: 0;
      transform: translateX(-4px);
      transition: all var(--transition-base);
    }
    .category-card:hover .category-arrow {
      opacity: 1;
      transform: translateX(0);
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    /* Trust Section */
    .trust-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    .trust-card {
      text-align: center;
      padding: 32px 20px;
      border-radius: var(--radius-lg);
      background: white;
      border: 1px solid var(--grey-100);
      transition: all var(--transition-base);
    }
    .trust-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }
    .trust-icon {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: var(--primary-50);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .trust-icon .material-icons-outlined { font-size: 28px; color: var(--primary); }
    .trust-card h3 {
      font-size: 15px;
      font-weight: 700;
      color: var(--grey-900);
      margin-bottom: 8px;
    }
    .trust-card p {
      font-size: 13px;
      line-height: 1.6;
      color: var(--grey-500);
    }

    /* CTA */
    .cta-section {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      padding: 60px 0;
    }
    .cta-content {
      text-align: center;
      color: white;
    }
    .cta-content h2 {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 12px;
    }
    .cta-content p {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 24px;
    }
    .cta-content .btn-primary {
      background: white;
      color: var(--primary-dark);
    }
    .cta-content .btn-primary:hover { background: var(--grey-100); }

    @media (max-width: 1024px) {
      .categories-grid { grid-template-columns: repeat(3, 1fr); }
      .products-grid { grid-template-columns: repeat(3, 1fr); }
      .trust-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .hero-content { grid-template-columns: 1fr; }
      .hero-visual { display: none; }
      .hero h1 { font-size: 32px; }
      .hero-features { flex-wrap: wrap; gap: 12px; }
      .categories-grid { grid-template-columns: repeat(2, 1fr); }
      .products-grid { grid-template-columns: repeat(2, 1fr); }
      .trust-grid { grid-template-columns: 1fr; }
      .cta-content h2 { font-size: 24px; }
      .section-header { flex-direction: column; align-items: flex-start; gap: 8px; }
    }
  `]
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
