import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  city?: string;
  zipCode?: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role || '');

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  register(data: { fullName: string; email: string; password: string; phone?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout(): void {
    localStorage.removeItem('pp_token');
    localStorage.removeItem('pp_user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        localStorage.setItem('pp_user', JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, data).pipe(
      tap(res => {
        const user: User = {
          id: res.id,
          email: res.email,
          fullName: res.fullName,
          phone: res.phone,
          address: res.address,
          city: res.city,
          zipCode: res.zipCode,
          role: res.role
        };
        localStorage.setItem('pp_user', JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('pp_token');
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'ADMIN';
  }

  getToken(): string | null {
    return localStorage.getItem('pp_token');
  }

  private handleAuth(res: AuthResponse): void {
    localStorage.setItem('pp_token', res.token);
    const user: User = {
      id: 0,
      email: res.email,
      fullName: res.fullName,
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      role: res.role
    };
    localStorage.setItem('pp_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUserFromStorage(): void {
    const stored = localStorage.getItem('pp_user');
    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored));
      } catch {
        this.logout();
      }
    }
  }
}
