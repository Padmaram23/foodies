import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-success.html',
  styleUrl: './order-success.scss'
})
export class OrderSuccessComponent implements OnInit {
  status = signal<'loading' | 'success' | 'failed'>('loading');

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cart: CartService,
    public router: Router
  ) {}

  ngOnInit() {
    const sessionId = this.route.snapshot.queryParams['session_id'];
    const orderId = this.route.snapshot.queryParams['order_id'];

    if (!sessionId || !orderId) {
      this.status.set('failed');
      return;
    }

    this.orderService.confirmPayment(orderId, sessionId).subscribe({
      next: () => {
        this.cart.clear();
        this.status.set('success');
      },
      error: () => this.status.set('failed')
    });
  }
}
