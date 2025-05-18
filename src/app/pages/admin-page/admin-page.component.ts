import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Firestore, collection, getDocs, query, where, orderBy, limit, startAfter, Timestamp } from '@angular/fire/firestore';
import { User } from '../../shared/models/User';
import { PurchaseHistory } from '../../shared/models/PurchaseHistory';

function toDateSafe(date: any): Date {
  if (!date) return new Date(0);
  if (typeof date.toDate === 'function') return date.toDate();
  if (date instanceof Date) return date;
  return new Date(date);
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent implements OnInit {
  userCount = 0;
  recentOrders: any[] = [];
  mostExpensiveOrder: any = null;
  usersRegistered2025 = 0;

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    await this.loadStatistics();
  }

  async loadStatistics() {

    const usersRef = query(
      collection(this.firestore, 'Users'),
      where('email', '>=', '@'),
      orderBy('email'),
      limit(100)
    );
    const usersSnap = await getDocs(usersRef);
    const users: User[] = [];
    usersSnap.forEach(doc => users.push(doc.data() as User));

    const usersWithPurchase = users.filter(u => Array.isArray(u.purchaseHistory) && u.purchaseHistory.length > 0);
    this.userCount = usersWithPurchase.length;

    let allOrders: { order: PurchaseHistory, user: User }[] = [];
    usersWithPurchase.forEach(user => {
      (user.purchaseHistory || []).forEach(order => {
        allOrders.push({
          order: {
            ...order,
            purchaseDate: toDateSafe(order.purchaseDate)
          },
          user
        });
      });
    });

    allOrders.sort((a, b) => b.order.purchaseDate.getTime() - a.order.purchaseDate.getTime());
    this.recentOrders = allOrders.slice(0, 5).map(x => ({
      ...x.order,
      userName: x.user.name
    }));

    this.usersRegistered2025 = usersWithPurchase.filter(user =>
      (user.purchaseHistory || []).some(order => {
        const d = toDateSafe(order.purchaseDate);
        return d.getFullYear() === 2025;
      })
    ).length;


    if (allOrders.length > 5) {
      const lastOrder = allOrders[4];
    }
  }
}