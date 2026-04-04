import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  placeOrder(items: { dish_id: string; quantity: number }[]) {
    return this.http.post<{ order_id: string; checkout_url: string }>(
      this.API, { items }, { headers: this.headers() }
    );
  }

  confirmPayment(orderId: string, session_id: string) {
    return this.http.post<Order>(
      `${this.API}/${orderId}/confirm`,
      { session_id },
      { headers: this.headers() }
    );
  }

  getMyOrders() {
    return this.http.get<Order[]>(this.API, { headers: this.headers() });
  }
}
