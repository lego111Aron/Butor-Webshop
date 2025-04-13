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

  // User típusú változó
  user: User | null = null;

  formattedAddress: string = '';

  constructor(private fb: FormBuilder) {
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
      this.loading = true;

      // A form értékeinek átmásolása a user változóba
      this.user = {
        userId: Date.now(), // Ideiglenes azonosító
        name: this.signupForm.value.username,
        streetAndHouseNumber: this.signupForm.value.address,
        email: this.signupForm.value.email,
        zipCode: +this.signupForm.value.zipCode,
        password: this.signupForm.value.password,
        userRole: 'felhasználó', // Alapértelmezett szerepkör
        shoppingCart: [],
        purchaseHistory: []
      };

      // Lakcím formázása
      this.formatAddress();

      setTimeout(() => {
        this.loading = false;
        console.log('Regisztrációs adatok:', this.user);
      }, 3000);
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