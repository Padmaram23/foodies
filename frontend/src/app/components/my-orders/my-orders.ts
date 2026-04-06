import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { ReviewService } from '../../services/review.service';
import { Order } from '../../models/order.model';
import { ReviewableItem } from '../../models/review.model';
import { ReviewFormComponent } from '../review-form/review-form';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, ReviewFormComponent],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss'
})
export class MyOrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  expandedId: string | null = null;
  selectedSeller: any = null;
  reviewableItems = signal<ReviewableItem[]>([]);
  activeReview: ReviewableItem | null = null;

  constructor(
    private orderService: OrderService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: orders => { this.orders.set(orders); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
    this.reviewService.getReviewableItems().subscribe({
      next: items => this.reviewableItems.set(items)
    });
  }

  toggle(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  showSeller(item: any, event: Event) {
    event.stopPropagation();
    this.selectedSeller = this.selectedSeller?.seller_id === item.seller_id ? null : item;
  }

  isReviewable(orderId: string, dishId: string): boolean {
    return this.reviewableItems().some(i => i.order_id === orderId && i.dish_id === dishId);
  }

  openReview(orderId: string, dishId: string) {
    this.activeReview = this.reviewableItems().find(
      i => i.order_id === orderId && i.dish_id === dishId
    ) ?? null;
  }

  onReviewSubmitted() {
    this.activeReview = null;
    // Remove reviewed item from list
    this.reviewableItems.update(items =>
      items.filter(i => !(i.order_id === this.activeReview?.order_id && i.dish_id === this.activeReview?.dish_id))
    );
    this.reviewService.getReviewableItems().subscribe({
      next: items => this.reviewableItems.set(items)
    });
  }
}
