import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true, // Ha standalone komponens, akkor szükséges
  imports: [
    MatButtonModule, // Angular Material gombok
    MatIconModule,   // Angular Material ikonok
    RouterModule     // RouterLink használatához
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}