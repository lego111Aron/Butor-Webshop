import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatBadgeModule,
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, AfterViewInit {
  @Input() sidenav!: MatSidenav;
  @Input() isLoggedIn: boolean = false;
  @Output() logoutEvent = new EventEmitter<void>();
  @Input() cartItemCount: number = 0;
  @Input() isAdmin: boolean = false;

  constructor() {
    console.log("constructor called");
  }

  ngOnInit(): void {
    console.log("ngOnInit called");
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit called");
  }

  closeMenu() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  // TODO: lehet, hogy itt hiba van, de itt a régi verzió:
  // logout() {
  //   localStorage.setItem('isLoggedIn', 'false');
  //   window.location.href = '/home';
  //   this.closeMenu();
  // }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.logoutEvent.emit();
    this.closeMenu();
  }
}