import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  template: `
    @if (!isAdminRoute) {
      <app-header />
    }
    
    <main [class.main-content]="!isAdminRoute">
      <router-outlet />
    </main>

    @if (!isAdminRoute) {
      <app-footer />
    }
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - var(--header-height) - 300px);
      padding-top: var(--header-height);
    }
  `]
})
export class AppComponent implements OnInit {
  isAdminRoute = false;

  constructor(private router: Router) {
    this.checkRoute(this.router.url);
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.urlAfterRedirects);
    });
  }

  private checkRoute(url: string) {
    // If route exactly matches '/admin' or any route starting with '/admin/'
    this.isAdminRoute = url === '/admin' || url.startsWith('/admin/');
  }
}
