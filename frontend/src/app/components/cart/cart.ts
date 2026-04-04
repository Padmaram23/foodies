import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {
  loading = signal(false);
  error = signal('');

  constructor(
    public cart: CartService,
    private orderService: OrderService,
    public router: Router
  ) {}

  checkout() {
    if (this.cart.cartItems().length === 0) return;
    this.loading.set(true);
    this.error.set('');

    const items = this.cart.cartItems().map(i => ({ dish_id: i.dish_id, quantity: i.quantity }));

    this.orderService.placeOrder(items).subscribe({
      next: res => {
        // Redirect to Stripe hosted checkout page
        window.location.href = res.checkout_url;
      },
      error: err => {
        this.loading.set(false);
        if (err.status === 0) {
          this.error.set('Cannot reach the server. Please try again.');
        } else {
          this.error.set(err.error?.message || 'Failed to place order');
        }
      }
    });
  }
}
