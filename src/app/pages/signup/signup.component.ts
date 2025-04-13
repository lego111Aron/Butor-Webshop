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
import { RouterModule } from '@angular/router';
import { AddressFormatterPipe } from '../../shared/pipes/address.pipe';
import { User } from '../../shared/models/User';
import { Router } from '@angular/router';

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

  user: User | null = null;

  formattedAddress: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]], // Új mező validációval
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const password = this.signupForm.value.password;
      const confirmPassword = this.signupForm.value.confirmPassword;
  
      switch (true) {
        case password !== confirmPassword:
          alert('A jelszavak nem egyeznek meg!');
          return;
  
        case !/(?=.*[a-zA-Z])(?=.*\d)/.test(password):
          alert('A jelszónak tartalmaznia kell legalább egy betűt és egy számot!');
          return;
  
        default:
          this.loading = true;

          this.user = {
            userId: Date.now(),
            name: this.signupForm.value.username,
            streetAndHouseNumber: this.signupForm.value.address,
            email: this.signupForm.value.email,
            zipCode: +this.signupForm.value.zipCode,
            password: password,
            userRole: 'felhasználó',
            shoppingCart: [],
            purchaseHistory: []
          };
  
          // Lakcím formázása
          this.formatAddress();
  
          setTimeout(() => {
            this.loading = false;
            console.log('Regisztrációs adatok:', this.user);
            this.router.navigate(['/login']); // Navigáció a bejelentkezési oldalra
          }, 3000);
      }
    }
  }

  formatAddress(): void {
    if (this.user) {
      const pipe = new AddressFormatterPipe();
      this.formattedAddress = pipe.transform(this.user.streetAndHouseNumber);
      console.log('Formázott lakcím:', this.formattedAddress);
    }
  }
}