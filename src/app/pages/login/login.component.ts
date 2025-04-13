import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule, // Spinner modul importálása
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false; // Töltőképernyő állapota

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      // Statikus bejelentkezési adatok
      const validUsername = 'test';
      const validPassword = 'test';
  
      if (username === validUsername && password === validPassword) {
        this.loading = true; // Töltőképernyő megjelenítése
        setTimeout(() => {
          this.loading = false; // Töltőképernyő elrejtése
          localStorage.setItem('isLoggedIn', 'true'); // Bejelentkezés állapot mentése
          window.location.href = '/home'; // Átirányítás a főoldalra
        }, 1000);
      } else {
        alert('Hibás felhasználónév vagy jelszó!');
      }
    }
  }
}