import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { user, User } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

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
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnDestroy {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  isLoading: boolean = false;
  loginError: string = '';
  showLoginForm: boolean = true;
  authSubscription?: Subscription;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  login() {
    if (this.email.invalid) {
      this.loginError = 'Please enter a valid email address';
      return;
    }
    
    if (this.password.invalid) {
      this.loginError = 'Password must be at least 6 characters long';
      return;
    }

    const emailValue = this.email.value || '';
    const passwordValue = this.password.value || '';
    
    this.isLoading = true;
    this.showLoginForm = false;
    this.loginError = '';

    this.authService.signIn(emailValue, passwordValue)
      .then(userCredential => {
        console.log('Login successful:', userCredential.user);
        this.authService.updateLoginStatus(true);
        this.router.navigateByUrl('/home');
      })
      .catch(error => {
        console.error('Login error:', error);
        this.isLoading = false;
        this.showLoginForm = true;
        
        switch(error.code) {
          case 'auth/user-not-found':
            this.loginError = 'No account found with this email address';
            break;
          case 'auth/wrong-password':
            this.loginError = 'Incorrect password';
            break;
          case 'auth/invalid-credential':
            this.loginError = 'Invalid email or password';
            break;
          default:
            this.loginError = 'Authentication failed. Please try again later.';
        }
      });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}