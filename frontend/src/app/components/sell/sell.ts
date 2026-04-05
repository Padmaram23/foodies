import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DishService } from '../../services/dish.service';
import { EarningsService, Earnings } from '../../services/earnings.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { AddDishComponent } from '../add-dish/add-dish';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { Dish } from '../../models/dish.model';

interface DishGroup { date: string; label: string; dishes: Dish[]; }

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, DatePipe, AddDishComponent, ConfirmDialogComponent],
  templateUrl: './sell.html',
  styleUrl: './sell.scss'
})
export class SellComponent implements OnInit {
  showPrompt = false;
  showAddForm = signal(false);
  dishes = signal<Dish[]>([]);
  confirmDeleteId: string | null = null;
  deleting = false;
  earnings = signal<Earnings | null>(null);
  showHistory = signal(false);
  receivedOrders = signal<Order[]>([]);
  showOrders = signal(false);

  dishGroups = computed<DishGroup[]>(() => {
    const map = new Map<string, Dish[]>();
    for (const dish of this.dishes()) {
      const key = dish.created_at ? dish.created_at.slice(0, 10) : 'unknown';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(dish);
    }
    return Array.from(map.entries()).map(([date, dishes]) => ({
      date,
      label: this._dateLabel(date),
      dishes
    }));
  });

  private _datePipe = new DatePipe('en-US');

  constructor(
    public auth: AuthService,
    public router: Router,
    private dishService: DishService,
    private earningsService: EarningsService,
    private orderService: OrderService
  ) {
    this.showPrompt = !auth.currentUser()?.is_seller;
  }

  ngOnInit() {
    if (!this.showPrompt) {
      this.loadDishes();
      this.earningsService.getEarnings().subscribe({ next: e => this.earnings.set(e) });
      this.orderService.getReceivedOrders().subscribe({ next: o => this.receivedOrders.set(o) });
    }
  }

  loadDishes() {
    this.dishService.getMyDishes().subscribe({ next: dishes => this.dishes.set(dishes) });
  }

  onDishSaved(dish: Dish) {
    this.dishes.update(list => [dish, ...list]);
    this.showAddForm.set(false);
  }

  deleteDish(id: string) {
    this.deleting = true;
    this.dishService.deleteDish(id).subscribe({
      next: () => {
        this.dishes.update(list => list.filter(d => d.id !== id));
        this.confirmDeleteId = null;
        this.deleting = false;
      },
      error: () => { this.deleting = false; }
    });
  }

  onAddDish() { this.showAddForm.set(true); }

  private _dateLabel(dateStr: string): string {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const d = new Date(dateStr);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return this._datePipe.transform(d, 'MMMM d, y') ?? dateStr;
  }
}
