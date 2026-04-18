import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form = { fullName: '', email: '', password: '', phone: '' };
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  register(): void {
    this.error = '';
    this.loading = true;
    this.auth.register(this.form).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/']); },
      error: (err) => { this.loading = false; this.error = err.error?.error || 'Erreur lors de l\'inscription'; }
    });
  }
}
