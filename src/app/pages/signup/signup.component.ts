import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  signupError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupError = 'Kérjük, javítsd a hibákat a formon!';
      return;
    }

    const password = this.signupForm.value.password;
    const confirmPassword = this.signupForm.value.confirmPassword;

    if (password !== confirmPassword) {
      this.signupError = 'A jelszavak nem egyeznek meg!';
      return;
    }

    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      this.signupError = 'A jelszónak tartalmaznia kell legalább egy betűt és egy számot!';
      return;
    }

    this.loading = true;
    this.signupError = '';

    const userData: Partial<User> = {
      name: this.signupForm.value.name,
      streetAndHouseNumber: this.signupForm.value.address,
      email: this.signupForm.value.email,
      zipCode: +this.signupForm.value.zipCode,
      userRole: 'felhasználó',
      shoppingCart: [],
      purchaseHistory: []
    };

    const email = this.signupForm.value.email;
    const pw = this.signupForm.value.password;

    this.authService.signUp(email, pw, userData)
      .then(userCredential => {
        this.authService.updateLoginStatus(true);
        this.router.navigateByUrl('/home');
      })
      .catch(error => {
        this.loading = false;
        switch(error.code) {
          case 'auth/email-already-in-use':
            this.signupError = 'Ez az email már használatban van.';
            break;
          case 'auth/invalid-email':
            this.signupError = 'Érvénytelen email.';
            break;
          case 'auth/weak-password':
            this.signupError = 'A jelszó túl gyenge. Legalább 6 karakter legyen.';
            break;
          default:
            this.signupError = 'Hiba történt a regisztráció során. Próbáld újra később.';
        }
      });
  }
}