import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User as AppUser } from '../models/User';
import { Injectable } from '@angular/core';
import { docData } from '@angular/fire/firestore';

import { 
  Auth, 
  signInWithEmailAndPassword,
  signOut,
  authState,
  User,
  UserCredential,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<User | null>;
    private _isAdmin = false;
  
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.currentUser = authState(this.auth);
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(() => this.updateLoginStatus(true))
    );
  }
  
  // signIn(email: string, password: string): Promise<UserCredential> {
  //   return signInWithEmailAndPassword(this.auth, email, password);
  // }
  
  signOut(): Promise<void> {
    localStorage.setItem('isLoggedIn', 'false');
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/home');
    });
  }
  
  isLoggedIn(): Observable<User | null> {
    return this.currentUser;
  }
  
  updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }

  async updateUserData(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(collection(this.firestore, 'Users'), userId);
    return setDoc(userRef, userData, { merge: true });
  }
  
  getUserData(userId: string): Observable<User | undefined> {
    const userRef = doc(this.firestore, 'Users', userId);
    return docData(userRef) as Observable<User | undefined>;
  }

  async signUp(email: string, password: string, userData: Partial<AppUser>): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const userDoc = doc(this.firestore, `Users/${userCredential.user.uid}`);
      await setDoc(userDoc, {
        ...userData,
        userId: userCredential.user.uid, // vagy id, ha úgy használod
        email: email,
        shoppingCart: [],
        purchaseHistory: []
      });

      return userCredential;
    } catch (error) {
      console.error('Hiba a regisztráció során:', error);
      throw error;
    }
  }

  getCurrentUserSync(): User | null {
    return this.auth.currentUser;
  }


  setAdminStatus(email: string) {
    const isAdmin = (email === 'admin@admin.com');
    this._isAdmin = isAdmin;
    localStorage.setItem('isAdmin', isAdmin ? '1' : '0');
  }
  get isAdmin(): boolean {
    return this._isAdmin || localStorage.getItem('isAdmin') === '1';
  }
}