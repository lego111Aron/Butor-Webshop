import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card'; // <== MatCard hozzáadása
import { User } from '../../shared/models/User';
import { Injectable } from '@angular/core';
import { ShoppingCart } from '../../shared/models/ShoppingCart';
import { PurchaseHistory } from '../../shared/models/PurchaseHistory';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule // <== Fontos!
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: User = {
    userId: 1,
    name: 'test',
    streetAndHouseNumber: 'Test út, 395',
    email: 'test@test.com',
    zipCode: 1000,
    password: 'test',
    userRole: 'felhasználó',
    shoppingCart: [],
    purchaseHistory: []
  };

  get usernameInitial(): string {
    return this.user.name.charAt(0).toUpperCase();
  }

  getUserRoleText(): string {
    switch (this.user.userRole) {
      case 'admin':
        return 'Ez egy admin profil';
      case undefined:
      case null:
        return 'Hiányzó jogosultság';
      default:
        return 'Bejelentkezett felhasználó';
    }
  }

  shoppingCart: ShoppingCart[] = [
    { itemId: 1, itemName: 'Asztal', price: 50000, quantity: 1 },
    { itemId: 2, itemName: 'Szék', price: 15000, quantity: 1 },
    { itemId: 3, itemName: 'Kanapé', price: 120000, quantity: 1 }
  ];

  getTotalPrice(): number {
    return this.shoppingCart.reduce((total, item) => total + item.price, 0);
  }

  addToCart(item: ShoppingCart): void {
    this.shoppingCart.push(item);
  }

  getCartItems(): ShoppingCart[] {
    return this.shoppingCart;
  }

  clearCart(): void {
    this.shoppingCart = [];
  }

  purchaseHistory: PurchaseHistory[] = [
    {
      itemId: 1,
      itemName: 'Asztal',
      purchasePrice: 50000,
      purchaseDate: new Date('2023-01-15')
    },
    {
      itemId: 2,
      itemName: 'Szék',
      purchasePrice: 15000,
      purchaseDate: new Date('2023-02-20')
    },
    {
      itemId: 3,
      itemName: 'Kanapé',
      purchasePrice: 120000,
      purchaseDate: new Date('2023-03-10')
    }
  ];

  onPurchase(): void {
    if (this.shoppingCart.length === 0) {
      alert('A kosár üres! Kérjük, adjon hozzá termékeket.');
      return;
    }
  
    // Vásárlási logika (pl. adatok mentése, kosár ürítése)
    alert('Köszönjük a vásárlást!');
    this.clearCart(); // Kosár ürítése
  }
}
