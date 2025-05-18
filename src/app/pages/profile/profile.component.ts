import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';
import { ShoppingCart } from '../../shared/models/ShoppingCart';
import { PurchaseHistory } from '../../shared/models/PurchaseHistory';
import { ShoppingcartService } from '../../shared/services/shoppingcart.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule
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

  private subscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private shoppingcartService: ShoppingcartService
  ) {}

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
        // Átalakítás: minden purchaseHistory elem purchaseDate-jét Date-re konvertáljuk, ha Timestamp
        this.purchaseHistory = (data.user?.purchaseHistory || []).map(history => ({
          ...history,
          purchaseDate: isTimestamp(history.purchaseDate)
            ? history.purchaseDate.toDate()
            : history.purchaseDate
        }));
        this.stats = data.stats ?? { cartItems: 0, purchaseCount: 0, totalSpent: 0 };
        this.isLoading = false;
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

  clearCart(): void {
    this.shoppingCart = [];
  }

  async onPurchase(): Promise<void> {
    if (this.shoppingCart.length === 0) {
      alert('A kosár üres! Kérjük, adjon hozzá termékeket.');
      return;
    }
    try {
      await this.shoppingcartService.purchaseCart();
      alert('Köszönjük a vásárlást!');
      this.loadUserProfile(); // Frissítsd a profilt, hogy látszódjon a változás
    } catch (error: any) {
      alert(error.message || 'Hiba történt a vásárlás során!');
    }
  }
  
}

function isTimestamp(obj: any): obj is Timestamp {
  return obj && typeof obj.toDate === 'function';
}
