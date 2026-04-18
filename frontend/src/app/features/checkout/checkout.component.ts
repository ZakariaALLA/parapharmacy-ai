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
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
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
