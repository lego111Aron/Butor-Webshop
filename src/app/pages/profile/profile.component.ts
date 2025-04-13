import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card'; // <== MatCard hozzáadása

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatCardModule // <== Fontos!
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  username: string = 'test';
  userRole: string = 'felhasználó';

  get usernameInitial(): string {
    return this.username.charAt(0).toUpperCase();
  }

  getUserRoleText(): string {
    switch (this.userRole) {
      case 'admin':
        return 'Ez egy admin profil';
      case undefined:
      case null:
        return 'Hiányzó jogosultság';
      default:
        return 'Bejelentkezett felhasználó';
    }
  }
}