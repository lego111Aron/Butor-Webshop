import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { ShoppingCart } from '../models/ShoppingCart';
import { User } from '../models/User';
import { Observable, from, of, switchMap, map } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { PurchaseHistory } from '../models/PurchaseHistory';
  

@Injectable({
  providedIn: 'root'
})
export class ShoppingcartService {
  private readonly USERS_COLLECTION = 'Users';

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  // Kosár lekérdezése
  getCart(): Observable<ShoppingCart[]> {
    return this.authService.currentUser.pipe(
      switchMap(user => {
        if (!user) return of([]);
        const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
        return from(getDoc(userDocRef)).pipe(
          map(userDoc => {
            if (!userDoc.exists()) return [];
            const userData = userDoc.data() as User;
            return userData.shoppingCart || [];
          })
        );
      })
    );
  }

  // Kosárhoz adás
  async addToCart(item: ShoppingCart): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('No authenticated user found');
    const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw new Error('User not found');
    const userData = userDoc.data() as User;
    const cart = userData.shoppingCart || [];
    // Ha már van ilyen termék, csak növeljük a mennyiséget
    const existing = cart.find(i => i.itemId === item.itemId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    await updateDoc(userDocRef, { shoppingCart: cart });
  }

  // Kosárból törlés
  async removeFromCart(itemId: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('No authenticated user found');
    const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw new Error('User not found');
    const userData = userDoc.data() as User;
    const cart = (userData.shoppingCart || []).filter(i => i.itemId !== itemId);
    await updateDoc(userDocRef, { shoppingCart: cart });
  }

  // Kosár ürítése
  async clearCart(): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('No authenticated user found');
    const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
    await updateDoc(userDocRef, { shoppingCart: [] });
  }

  // Segédfüggvény a bejelentkezett user lekéréséhez
  private async getCurrentUser() {
    return await firstValueFrom(this.authService.currentUser);
  }

  async purchaseCart(): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('No authenticated user found');
    const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw new Error('User not found');
    const userData = userDoc.data() as User;
  
    const cart = userData.shoppingCart || [];
    if (cart.length === 0) throw new Error('A kosár üres!');
  
    // Új vásárlási előzmény létrehozása
    const newHistory: PurchaseHistory = {
      itemId: Date.now(), // vagy generálj egyedi azonosítót
      shoppingCart: [...cart],
      purchaseDate: new Date()
    };
  
    const updatedHistory = [...(userData.purchaseHistory || []), newHistory];
  
    // Firestore frissítése: purchaseHistory bővítése, kosár ürítése
    await updateDoc(userDocRef, {
      purchaseHistory: updatedHistory,
      shoppingCart: []
    });
  }
}