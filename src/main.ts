import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(), provideFirebaseApp(() => initializeApp({ projectId: "butorwebshop-613f5", appId: "1:185335966750:web:97a6f406ca02228e54520f", storageBucket: "butorwebshop-613f5.firebasestorage.app", apiKey: "AIzaSyBVkRbRBOfn8vQYX88NHfLf7vkAJixRy3Q", authDomain: "butorwebshop-613f5.firebaseapp.com", messagingSenderId: "185335966750" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
}).catch(err => console.error(err));