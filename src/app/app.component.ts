import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
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
  // isDropdownOpen = false;
  // cartItemCount = 3;
  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      localStorage.setItem('isLoggedIn', this.isLoggedIn ? 'true' : 'false');
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  // TODO: lehet, hogy itt hiba van, de itt a régi verzió:
  // logout(): void {
  //   localStorage.setItem('isLoggedIn', 'false');
  //   this.isLoggedIn = false;
  //   window.location.href = '/home';
  // }

  logout(): void {
    this.authService.signOut();
  }

  // toggleDropdownMenu(): void {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  // }

  onToggleSidenav(sidenav: MatSidenav): void {
    sidenav.toggle();
  }
  
}