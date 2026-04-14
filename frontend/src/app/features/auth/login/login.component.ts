import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card animate-fade-in-up">
        <div class="auth-header">
          <span class="logo-icon">💊</span>
          <h1>Connexion</h1>
          <p>Connectez-vous à votre compte ParaPharma</p>
        </div>

        <form (ngSubmit)="login()">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" [(ngModel)]="email" name="email" placeholder="votre@email.com" required>
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input id="password" type="password" [(ngModel)]="password" name="password" placeholder="••••••" required>
          </div>

          @if (error) {
            <div class="error-msg">
              <span class="material-icons">error_outline</span>
              {{ error }}
            </div>
          }

          <button type="submit" class="btn-primary submit-btn" [disabled]="loading">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <p class="auth-footer">
          Pas encore de compte ?
          <a routerLink="/inscription">Créer un compte</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 40px 16px;
    }
    .auth-card {
      width: 100%; max-width: 420px; background: white;
      border-radius: var(--radius-xl); padding: 40px;
      box-shadow: var(--shadow-xl); border: 1px solid var(--grey-100);
    }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-header .logo-icon { font-size: 40px; }
    .auth-header h1 { font-size: 24px; font-weight: 800; margin: 12px 0 4px; }
    .auth-header p { color: var(--grey-500); font-size: 14px; }
    .form-group { margin-bottom: 18px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--grey-700); margin-bottom: 6px; }
    .form-group input {
      width: 100%; padding: 12px 14px;
      border: 1.5px solid var(--grey-200); border-radius: var(--radius-md);
      font-size: 14px; transition: all var(--transition-fast);
    }
    .form-group input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-50); }
    .error-msg {
      display: flex; align-items: center; gap: 8px;
      padding: 12px; background: #FEE2E2; border-radius: var(--radius-md);
      color: #991B1B; font-size: 13px; margin-bottom: 16px;
    }
    .submit-btn { width: 100%; padding: 14px; font-size: 15px; }
    .auth-footer { text-align: center; margin-top: 20px; font-size: 13px; color: var(--grey-500); }
    .auth-footer a { color: var(--primary); font-weight: 600; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    this.error = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'ADMIN') this.router.navigate(['/admin']);
        else this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Email ou mot de passe incorrect';
      }
    });
  }
}
