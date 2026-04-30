import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'ParaPharma Maroc - Votre Parapharmacie en Ligne'
  },
  {
    path: 'produits',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent),
    title: 'Nos Produits - ParaPharma Maroc'
  },
  {
    path: 'produit/:slug',
    loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Détail Produit - ParaPharma Maroc'
  },
  {
    path: 'recherche',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent),
    title: 'Recherche - ParaPharma Maroc'
  },
  {
    path: 'panier',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    title: 'Mon Panier - ParaPharma Maroc'
  },
  {
    path: 'liste-souhaits',
    loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent),
    canActivate: [authGuard],
    title: 'Ma Liste de Souhaits - ParaPharma Maroc'
  },
  {
    path: 'commander',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'Commander - ParaPharma Maroc'
  },
  {
    path: 'profil',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'Mon Profil - ParaPharma Maroc'
  },
  {
    path: 'connexion',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Connexion - ParaPharma Maroc'
  },
  {
    path: 'inscription',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Inscription - ParaPharma Maroc'
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Tableau de Bord - Admin'
      },
      {
        path: 'produits',
        loadComponent: () => import('./features/admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent),
        title: 'Gestion Produits - Admin'
      },
      {
        path: 'commandes',
        loadComponent: () => import('./features/admin/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent),
        title: 'Gestion Commandes - Admin'
      }
    ]
  },
  {
    path: 'a-propos',
    loadComponent: () => import('./features/infos/about/about.component').then(m => m.AboutComponent),
    title: 'À Propos - ParaPharma Maroc'
  },
  {
    path: 'livraison',
    loadComponent: () => import('./features/infos/shipping/shipping.component').then(m => m.ShippingComponent),
    title: 'Livraison & Retours - ParaPharma Maroc'
  },
  {
    path: 'conditions',
    loadComponent: () => import('./features/infos/terms/terms.component').then(m => m.TermsComponent),
    title: 'Conditions Générales - ParaPharma Maroc'
  },
  {
    path: 'confidentialite',
    loadComponent: () => import('./features/infos/privacy/privacy.component').then(m => m.PrivacyComponent),
    title: 'Politique de Confidentialité - ParaPharma Maroc'
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/infos/faq/faq.component').then(m => m.FaqComponent),
    title: 'FAQ - ParaPharma Maroc'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
