import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  getUserProfile(): Observable<{
    user: User | null,
    stats: {
      cartItems: number,
      purchaseCount: number,
      totalSpent: number
    }
  }> {
    return this.authService.currentUser.pipe(
      switchMap(authUser => {
        if (!authUser) {
          return of({
            user: null,
            stats: { cartItems: 0, purchaseCount: 0, totalSpent: 0 }
          });
        }
        return from(this.fetchUserWithStats(authUser.uid));
      })
    );
  }

  private async fetchUserWithStats(userId: string): Promise<{
    user: User | null,
    stats: {
      cartItems: number,
      purchaseCount: number,
      totalSpent: number
    }
  }> {
    try {
      // Felhasználó adatainak lekérése
      const userDocRef = doc(this.firestore, 'Users', userId);
      const userSnapshot = await getDoc(userDocRef);
      
      if (!userSnapshot.exists()) {
        return {
          user: null,
          stats: { cartItems: 0, purchaseCount: 0, totalSpent: 0 }
        };
      }

      const user = userSnapshot.data() as User;

      // Kosár és vásárlási statisztikák
      const cartItems = user.shoppingCart ? user.shoppingCart.length : 0;
      const purchaseCount = user.purchaseHistory ? user.purchaseHistory.length : 0;
      const totalSpent = user.purchaseHistory
        ? user.purchaseHistory.reduce((sum, item) => sum + (item.purchasePrice || 0), 0)
        : 0;

      return {
        user,
        stats: {
          cartItems,
          purchaseCount,
          totalSpent
        }
      };
    } catch (error) {
      console.error('Hiba a felhasználói adatok betöltése során:', error);
      return {
        user: null,
        stats: { cartItems: 0, purchaseCount: 0, totalSpent: 0 }
      };
    }
  }
}