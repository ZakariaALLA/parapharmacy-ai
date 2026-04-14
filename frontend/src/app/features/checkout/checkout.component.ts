import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService, OrderCreate } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="checkout-page container">
      @if (orderPlaced) {
        <div class="success-state animate-fade-in-up">
          <div class="success-icon">
            <span class="material-icons">check_circle</span>
          </div>
          <h1>Commande confirmée ! 🎉</h1>
          <p>Votre commande #{{ orderId }} a été enregistrée avec succès.</p>
          <p>Vous serez contacté par téléphone pour confirmer la livraison.</p>
          <div class="success-details">
            <div class="detail-row">
              <span class="material-icons-outlined">person</span>
              <span>{{ form.customerName }}</span>
            </div>
            <div class="detail-row">
              <span class="material-icons-outlined">phone</span>
              <span>{{ form.phoneNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="material-icons-outlined">location_on</span>
              <span>{{ form.address }}, {{ form.city }}</span>
            </div>
          </div>
          <a routerLink="/" class="btn-primary">Retour à l'accueil</a>
        </div>
      } @else {
        <h1>Finaliser la commande</h1>
        @if (cart.items().length === 0) {
          <div class="empty">
            <p>Votre panier est vide</p>
            <a routerLink="/produits" class="btn-primary">Voir les produits</a>
          </div>
        } @else {
          <div class="checkout-layout">
            <div class="checkout-form">
              <h2>Informations de livraison</h2>

              <div class="form-group">
                <label for="customerName">Nom complet *</label>
                <input id="customerName" type="text" [(ngModel)]="form.customerName" placeholder="Votre nom complet" required>
              </div>

              <div class="form-group">
                <label for="phoneNumber">Numéro de téléphone *</label>
                <input id="phoneNumber" type="tel" [(ngModel)]="form.phoneNumber" placeholder="+212 6XX XXX XXX" required>
                <small>Format marocain : +212 ou 06/07</small>
              </div>

              <div class="form-group">
                <label for="address">Adresse complète *</label>
                <textarea id="address" [(ngModel)]="form.address" placeholder="Rue, numéro, quartier..." rows="3" required></textarea>
              </div>

              <div class="form-group">
                <label for="city">Ville *</label>
                <select id="city" [(ngModel)]="form.city" required>
                  <option value="">Sélectionner une ville</option>
                  @for (city of cities; track city) {
                    <option [value]="city">{{ city }}</option>
                  }
                </select>
              </div>

              @if (error) {
                <div class="error-msg">
                  <span class="material-icons">error_outline</span>
                  {{ error }}
                </div>
              }

              <button class="btn-primary submit-btn" (click)="placeOrder()" [disabled]="submitting">
                @if (submitting) {
                  <span>Commande en cours...</span>
                } @else {
                  <span class="material-icons-outlined">local_shipping</span>
                  <span>Confirmer la commande (Paiement à la livraison)</span>
                }
              </button>
            </div>

            <div class="order-summary">
              <h3>Votre commande</h3>
              @for (item of cart.items(); track item.productId) {
                <div class="summary-item">
                  <img [src]="item.imageUrl || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100'" [alt]="item.title">
                  <div class="summary-item-info">
                    <span class="summary-item-title">{{ item.title }}</span>
                    <span class="summary-item-qty">x{{ item.quantity }}</span>
                  </div>
                  <span class="summary-item-price">{{ item.price * item.quantity | number:'1.2-2' }} MAD</span>
                </div>
              }
              <div class="summary-total">
                <span>Total</span>
                <span>{{ cart.total() | number:'1.2-2' }} MAD</span>
              </div>
              <div class="cod-badge">
                <span class="material-icons-outlined">payments</span>
                Paiement à la livraison uniquement
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .checkout-page { padding: 32px 16px; max-width: 1000px; }
    .checkout-page h1 { font-size: 28px; font-weight: 800; margin-bottom: 24px; }
    .empty { text-align: center; padding: 60px; }

    .checkout-layout { display: grid; grid-template-columns: 1fr 360px; gap: 32px; align-items: start; }

    .checkout-form {
      background: white; padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--grey-100);
    }
    .checkout-form h2 { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
    .form-group { margin-bottom: 18px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--grey-700); margin-bottom: 6px; }
    .form-group input, .form-group textarea, .form-group select {
      width: 100%; padding: 11px 14px;
      border: 1.5px solid var(--grey-200); border-radius: var(--radius-md);
      font-size: 14px; transition: border-color var(--transition-fast); background: white;
    }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
      outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-50);
    }
    .form-group small { font-size: 11px; color: var(--grey-400); margin-top: 4px; display: block; }

    .error-msg {
      display: flex; align-items: center; gap: 8px;
      padding: 12px; background: #FEE2E2; border-radius: var(--radius-md);
      color: #991B1B; font-size: 13px; margin-bottom: 16px;
    }
    .submit-btn { width: 100%; padding: 14px; font-size: 15px; }

    .order-summary {
      background: white; padding: 24px; border-radius: var(--radius-lg);
      border: 1px solid var(--grey-100); position: sticky; top: calc(var(--header-height) + 110px);
    }
    .order-summary h3 { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
    .summary-item {
      display: flex; align-items: center; gap: 12px; padding: 10px 0;
      border-bottom: 1px solid var(--grey-100);
    }
    .summary-item img { width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover; }
    .summary-item-info { flex: 1; }
    .summary-item-title { font-size: 12px; font-weight: 600; display: block; color: var(--grey-800); }
    .summary-item-qty { font-size: 11px; color: var(--grey-400); }
    .summary-item-price { font-size: 13px; font-weight: 700; white-space: nowrap; }
    .summary-total {
      display: flex; justify-content: space-between; padding: 16px 0 12px;
      font-size: 18px; font-weight: 800;
    }
    .cod-badge {
      display: flex; align-items: center; gap: 8px;
      padding: 10px; background: var(--primary-50); border-radius: var(--radius-sm);
      font-size: 12px; font-weight: 600; color: var(--primary-dark);
    }

    .success-state { text-align: center; padding: 60px 20px; max-width: 500px; margin: 0 auto; }
    .success-icon .material-icons { font-size: 80px; color: var(--success); }
    .success-state h1 { font-size: 28px; margin: 16px 0 8px; }
    .success-state > p { color: var(--grey-500); font-size: 14px; margin-bottom: 8px; }
    .success-details {
      background: var(--bg-light); border-radius: var(--radius-md); padding: 20px;
      margin: 24px 0; text-align: left;
    }
    .detail-row {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 0; font-size: 14px; color: var(--grey-700);
    }
    .detail-row .material-icons-outlined { color: var(--primary); font-size: 18px; }

    @media (max-width: 768px) {
      .checkout-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class CheckoutComponent {
  form = { customerName: '', phoneNumber: '', address: '', city: '' };
  submitting = false;
  orderPlaced = false;
  orderId = 0;
  error = '';

  cities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda',
    'Kénitra', 'Tétouan', 'Safi', 'Mohammedia', 'El Jadida', 'Béni Mellal', 'Nador',
    'Taza', 'Settat', 'Berrechid', 'Khémisset', 'Inezgane', 'Khouribga', 'Ouarzazate',
    'Larache', 'Guelmim', 'Errachidia', 'Essaouira', 'Al Hoceima', 'Ifrane', 'Dakhla'
  ];

  constructor(
    public cart: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  placeOrder(): void {
    if (!this.form.customerName || !this.form.phoneNumber || !this.form.address || !this.form.city) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.error = '';
    this.submitting = true;

    const order: OrderCreate = {
      customerName: this.form.customerName,
      phoneNumber: this.form.phoneNumber,
      address: this.form.address,
      city: this.form.city,
      items: this.cart.items().map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(order).subscribe({
      next: (res) => {
        this.orderId = res.id;
        this.orderPlaced = true;
        this.cart.clearCart();
        this.submitting = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Une erreur est survenue. Veuillez réessayer.';
        this.submitting = false;
      }
    });
  }
}
