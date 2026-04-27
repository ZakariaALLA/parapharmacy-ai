import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService, OrderCreate } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
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
    private auth: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.auth.user();
    if (user) {
      this.form.customerName = user.fullName;
      this.form.phoneNumber = user.phone;
      this.form.address = user.address || '';
      this.form.city = user.city || '';
    }
  }

  placeOrder(): void {
    if (!this.form.customerName || !this.form.phoneNumber || !this.form.address || !this.form.city) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    const phoneRegex = /^(05|06|07)\d{8}$/;
    if (!phoneRegex.test(this.form.phoneNumber)) {
      this.error = 'Veuillez entrer un numéro de téléphone marocain valide (Ex: 0612345678)';
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
