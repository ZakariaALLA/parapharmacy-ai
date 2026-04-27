import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, User } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  loadingProfile = signal(false);
  loadingPassword = signal(false);
  profileMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);
  passwordMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);

  cities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda',
    'Kénitra', 'Tétouan', 'Safi', 'Mohammedia', 'El Jadida', 'Béni Mellal', 'Nador',
    'Taza', 'Settat', 'Berrechid', 'Khémisset', 'Inezgane', 'Khouribga', 'Ouarzazate',
    'Larache', 'Guelmim', 'Errachidia', 'Essaouira', 'Al Hoceima', 'Ifrane', 'Dakhla'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(05|06|07)\d{8}$/)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.fillForm(user);
    } else {
      this.authService.getMe().subscribe({
        next: (user) => this.fillForm(user),
        error: () => this.router.navigate(['/connexion'])
      });
    }
  }

  fillForm(user: User): void {
    this.profileForm.patchValue({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      zipCode: user.zipCode
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) {
        this.profileForm.markAllAsTouched();
        return;
    }

    this.loadingProfile.set(true);
    this.profileMessage.set(null);

    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (res: any) => {
        this.loadingProfile.set(false);
        this.profileMessage.set({ type: 'success', text: res.message || 'Profil mis à jour avec succès' });
      },
      error: (err: any) => {
        this.loadingProfile.set(false);
        this.profileMessage.set({
          type: 'error',
          text: err.error?.message || 'Une erreur est survenue lors de la mise à jour'
        });
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
        this.passwordForm.markAllAsTouched();
        return;
    }

    this.loadingPassword.set(true);
    this.passwordMessage.set(null);

    // We use the same updateProfile but only with password fields
    const data = {
        ...this.profileForm.value,
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
    };

    this.authService.updateProfile(data).subscribe({
      next: (res: any) => {
        this.loadingPassword.set(false);
        this.passwordMessage.set({ type: 'success', text: 'Mot de passe mis à jour avec succès' });
        this.passwordForm.reset();
      },
      error: (err: any) => {
        this.loadingPassword.set(false);
        this.passwordMessage.set({
          type: 'error',
          text: err.error?.message || 'Mot de passe actuel incorrect'
        });
      }
    });
  }
}
