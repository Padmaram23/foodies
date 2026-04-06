import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DishService } from '../../services/dish.service';
import { CartService } from '../../services/cart.service';
import { ReviewService } from '../../services/review.service';
import { Dish } from '../../models/dish.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss'
})
export class UserDashboardComponent implements OnInit {
  dishes = signal<Dish[]>([]);
  loading = signal(true);
  expandedId: string | null = null;
  viewMode: 'grid' | 'list' = 'grid';
  quantities: Record<string, number> = {};
  dishReviews: Record<string, Review[]> = {};
  businessPopup: { dish: Dish; reviews: Review[] } | null = null;
  loadingBusinessReviews = signal(false);

  constructor(public auth: AuthService, private dishService: DishService,
              public cart: CartService, private router: Router,
              private reviewService: ReviewService) {}

  ngOnInit() {
    this.dishService.getAvailableDishes().subscribe({
      next: dishes => {
        this.dishes.set(dishes);
        dishes.forEach(d => this.quantities[d.id] = 1);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggle(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
    if (this.expandedId && !this.dishReviews[id]) {
      this.reviewService.getDishReviews(id).subscribe({
        next: reviews => this.dishReviews[id] = reviews
      });
    }
  }

  addToCart(dish: Dish) {
    this.cart.addDish(dish, this.quantities[dish.id] || 1);
  }

  cartQty(dishId: string): number {
    return this.cart.cartItems().find(i => i.dish_id === dishId)?.quantity ?? 0;
  }

  isMaxed(dish: Dish): boolean {
    return this.cartQty(dish.id) >= dish.available_quantity;
  }

  goToCart() { this.router.navigate(['/cart']); }

  openBusinessReviews(dish: Dish, event: Event) {
    event.stopPropagation();
    if (!dish.business_profile_id) {
      // No business profile — show empty popup
      this.businessPopup = { dish, reviews: [] };
      return;
    }
    this.loadingBusinessReviews.set(true);
    this.reviewService.getBusinessReviews(dish.business_profile_id).subscribe({
      next: result => {
        this.businessPopup = { dish, reviews: result.reviews };
        this.loadingBusinessReviews.set(false);
      },
      error: () => {
        this.businessPopup = { dish, reviews: [] };
        this.loadingBusinessReviews.set(false);
      }
    });
  }
}
