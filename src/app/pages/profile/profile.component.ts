import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { ShoppingcartService } from '../../shared/services/shoppingcart.service';
import { User } from '../../shared/models/User';
import { ShoppingCart } from '../../shared/models/ShoppingCart';
import { PurchaseHistory } from '../../shared/models/PurchaseHistory';
import { Timestamp } from '@angular/fire/firestore';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  shoppingCart: ShoppingCart[] = [];
  purchaseHistory: PurchaseHistory[] = [];
  stats = {
    cartItems: 0,
    purchaseCount: 0,
    totalSpent: 0
  };
  isLoading = true;
  editForm: FormGroup;

  private subscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private shoppingcartService: ShoppingcartService
  ) {
    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      streetAndHouseNumber: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.subscription = this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data.user;
        this.shoppingCart = data.user?.shoppingCart || [];
        this.purchaseHistory = (data.user?.purchaseHistory || []).map(history => ({
          ...history,
          purchaseDate: isTimestamp(history.purchaseDate)
            ? history.purchaseDate.toDate()
            : history.purchaseDate
        }));
        this.stats = data.stats ?? { cartItems: 0, purchaseCount: 0, totalSpent: 0 };
        this.isLoading = false;
        // Form mezők feltöltése
        if (this.user) {
          this.editForm.patchValue({
            email: this.user.email,
            streetAndHouseNumber: this.user.streetAndHouseNumber,
            zipCode: this.user.zipCode
          });
        }
      },
      error: (error) => {
        console.error('Hiba a felhasználói profil betöltésekor:', error);
        this.isLoading = false;
      }
    });
  }

  get usernameInitial(): string {
    if (!this.user || !this.user.name) return '?';
    return this.user.name.charAt(0).toUpperCase();
  }

  getUserRoleText(): string {
    switch (this.user?.userRole) {
      case 'admin':
        return 'Ez egy admin profil';
      case undefined:
      case null:
        return 'Hiányzó jogosultság';
      default:
        return 'Bejelentkezett felhasználó';
    }
  }

  getTotalPrice(): number {
    return this.shoppingCart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  async onPurchase(): Promise<void> {
    if (this.shoppingCart.length === 0) {
      alert('A kosár üres! Kérjük, adjon hozzá termékeket.');
      return;
    }
    try {
      await this.shoppingcartService.purchaseCart();
      alert('Köszönjük a vásárlást!');
      this.loadUserProfile(); // Frissíti a kosarat és az előzményeket
    } catch (error: any) {
      alert(error.message || 'Hiba történt a vásárlás során!');
    }
  }

  async onUpdateProfile(): Promise<void> {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    if (!this.user) return;
  
    const { email, streetAndHouseNumber, zipCode, password } = this.editForm.value;
  
    try {
      // 1. Email, cím, irányítószám frissítése Firestore-ban
      await this.userService.updateUserProfile(this.user.userId, {
        email,
        streetAndHouseNumber,
        zipCode
      });
  
      // 2. Jelszó frissítése csak ha nem üres
      if (password && password.trim().length > 0) {
        await this.userService.updateUserPassword(email, password);
      }
  
      alert('Adatok sikeresen frissítve!');
      this.loadUserProfile();
      this.editForm.patchValue({ password: '' }); // ürítsd ki a jelszó mezőt
    } catch (error: any) {
      alert(error.message || 'Hiba történt a frissítés során!');
    }
  }
}

// Segédfüggvény Firestore Timestamp felismeréséhez
function isTimestamp(obj: any): obj is Timestamp {
  return obj && typeof obj.toDate === 'function';
}