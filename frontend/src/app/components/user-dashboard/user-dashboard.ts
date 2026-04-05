import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DishService } from '../../services/dish.service';
import { CartService } from '../../services/cart.service';
import { Dish } from '../../models/dish.model';

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

  constructor(public auth: AuthService, private dishService: DishService,
              public cart: CartService, private router: Router) {}

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
}
