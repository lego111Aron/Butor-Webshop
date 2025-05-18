import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatBadgeModule,
    MenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'learnflow';
  isLoggedIn = false;
  isDropdownOpen = false;
  cartItemCount = 3;
  private authSub?: Subscription;
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.isLoggedIn().subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = this.authService.isAdmin; // <-- admin státusz frissítése
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  logout(): void {
    this.authService.signOut();
  }

  toggleDropdownMenu(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}