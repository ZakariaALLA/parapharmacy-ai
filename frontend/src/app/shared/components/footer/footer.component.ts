import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand -->
          <div class="footer-col brand-col">
            <div class="footer-logo">
              <span class="logo-icon">💊</span>
              <div>
                <div class="logo-name">ParaPharma</div>
                <div class="logo-sub">Maroc</div>
              </div>
            </div>
            <p class="footer-desc">
              Votre parapharmacie en ligne de confiance au Maroc.
              Des produits authentiques, des prix compétitifs et
              une livraison partout au Maroc.
            </p>
            <div class="footer-badge">
              <span class="material-icons-outlined">verified</span>
              Produits 100% Authentiques
            </div>
          </div>

          <!-- Links -->
          <div class="footer-col">
            <h4>Catégories</h4>
            <a routerLink="/produits" [queryParams]="{categoryId: 1}">Dermo-Cosmétiques</a>
            <a routerLink="/produits" [queryParams]="{categoryId: 2}">Compléments Alimentaires</a>
            <a routerLink="/produits" [queryParams]="{categoryId: 3}">Hygiène</a>
            <a routerLink="/produits" [queryParams]="{categoryId: 4}">Soins Bébé</a>
            <a routerLink="/produits" [queryParams]="{categoryId: 5}">Soins de la Peau</a>
          </div>

          <div class="footer-col">
            <h4>Informations</h4>
            <a href="#">À Propos</a>
            <a href="#">Livraison & Retours</a>
            <a href="#">Conditions Générales</a>
            <a href="#">Politique de Confidentialité</a>
            <a href="#">FAQ</a>
          </div>

          <div class="footer-col">
            <h4>Contact</h4>
            <div class="contact-item">
              <span class="material-icons-outlined">email</span>
              contact&#64;parapharma.ma
            </div>
            <div class="contact-item">
              <span class="material-icons-outlined">phone</span>
              +212 5XX-XXXXXX
            </div>
            <div class="contact-item">
              <span class="material-icons-outlined">location_on</span>
              Casablanca, Maroc
            </div>
            <div class="payment-info">
              <span class="material-icons-outlined">local_shipping</span>
              <div>
                <strong>Paiement à la livraison</strong>
                <small>Partout au Maroc</small>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} ParaPharma Maroc. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--grey-900);
      color: var(--grey-300);
      padding: 60px 0 0;
      margin-top: 80px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
      gap: 40px;
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .footer-logo .logo-icon { font-size: 32px; }
    .footer-logo .logo-name { font-size: 20px; font-weight: 800; color: white; }
    .footer-logo .logo-sub { font-size: 10px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; }
    .footer-desc {
      font-size: 13px;
      line-height: 1.7;
      color: var(--grey-400);
      margin-bottom: 16px;
    }
    .footer-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: rgba(126, 217, 87, 0.1);
      border: 1px solid rgba(126, 217, 87, 0.2);
      border-radius: var(--radius-md);
      color: var(--primary);
      font-size: 12px;
      font-weight: 600;
    }
    .footer-badge .material-icons-outlined { font-size: 16px; }

    .footer-col h4 {
      color: white;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .footer-col a {
      display: block;
      font-size: 13px;
      color: var(--grey-400);
      padding: 6px 0;
      transition: color var(--transition-fast);
    }
    .footer-col a:hover { color: var(--primary); }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      margin-bottom: 12px;
      color: var(--grey-400);
    }
    .contact-item .material-icons-outlined { font-size: 18px; color: var(--primary); }

    .payment-info {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 16px;
      padding: 12px;
      background: rgba(255,255,255,0.05);
      border-radius: var(--radius-md);
    }
    .payment-info .material-icons-outlined { font-size: 24px; color: var(--primary); }
    .payment-info strong { display: block; font-size: 12px; color: white; }
    .payment-info small { font-size: 11px; color: var(--grey-400); }

    .footer-bottom {
      margin-top: 40px;
      padding: 20px 0;
      border-top: 1px solid rgba(255,255,255,0.08);
      text-align: center;
      font-size: 12px;
      color: var(--grey-500);
    }

    @media (max-width: 768px) {
      .footer { padding: 40px 0 0; }
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
