import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../models/dish.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss'
})
export class UserDashboardComponent implements OnInit {
  dishes = signal<Dish[]>([]);
  loading = signal(true);
  expandedId: string | null = null;

  constructor(public auth: AuthService, private dishService: DishService) {}

  ngOnInit() {
    this.dishService.getAvailableDishes().subscribe({
      next: dishes => { this.dishes.set(dishes); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  toggle(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }
}
