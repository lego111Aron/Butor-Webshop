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
  username: string = 'Béla Kovács';

  get usernameInitial(): string {
    return this.username.charAt(0).toUpperCase();
  }
}
