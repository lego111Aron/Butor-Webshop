import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Products } from '../../shared/models/Products';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products: Products[] = [
    {
      productId: 1,
      productName: 'Modern Kanapé',
      price: 120000,
      description: 'Ez a modern kanapé tökéletes választás nappalijába. Kényelmes, stílusos és tartós anyagból készült.',
      material: 'Szövet',
      type: 'Bútor'
    },
    {
      productId: 2,
      productName: 'Fa Étkezőasztal',
      price: 80000,
      description: 'Masszív fa étkezőasztal, amely elegáns megjelenést kölcsönöz otthonának.',
      material: 'Tömör fa',
      type: 'Bútor'
    },
    {
      productId: 3,
      productName: 'Irodai Szék',
      price: 45000,
      description: 'Ergonomikus irodai szék, amely kényelmes ülést biztosít hosszú órákon át.',
      material: 'Műanyag és fém',
      type: 'Irodabútor'
    },
    {
      productId: 4,
      productName: 'Kétszemélyes Ágy',
      price: 150000,
      description: 'Kényelmes és stílusos kétszemélyes ágy, amely tökéletes pihenést biztosít.',
      material: 'Fa és szövet',
      type: 'Bútor'
    },
    {
      productId: 5,
      productName: 'Könyvespolc',
      price: 60000,
      description: 'Tágas könyvespolc, amely elegáns tárolási lehetőséget kínál.',
      material: 'Laminált fa',
      type: 'Bútor'
    }
  ];
}