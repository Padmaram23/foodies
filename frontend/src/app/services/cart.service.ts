import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/order.model';
import { Dish } from '../models/dish.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  cartItems = this.items.asReadonly();

  total = computed(() =>
    this.items().reduce((sum, i) => sum + i.unit_price * i.quantity, 0)
  );

  count = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity, 0)
  );

  addDish(dish: Dish, quantity: number) {
    const price = dish.discounted_price ?? dish.price;
    const available = dish.available_quantity ?? dish.quantity;
    this.items.update(list => {
      const existing = list.find(i => i.dish_id === dish.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, available);
        return list.map(i => i.dish_id === dish.id ? { ...i, quantity: newQty } : i);
      }
      return [...list, {
        dish_id: dish.id,
        dish_name: dish.name,
        unit_price: price,
        quantity: Math.min(quantity, available),
        available_quantity: available,
        discount_percent: dish.discount_percent
      }];
    });
  }

  updateQuantity(dish_id: string, quantity: number) {
    if (quantity < 1) { this.remove(dish_id); return; }
    this.items.update(list => list.map(i =>
      i.dish_id === dish_id
        ? { ...i, quantity: Math.min(quantity, i.available_quantity) }
        : i
    ));
  }
  remove(dish_id: string) {
    this.items.update(list => list.filter(i => i.dish_id !== dish_id));
  }

  clear() { this.items.set([]); }
}
