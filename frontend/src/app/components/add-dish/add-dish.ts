import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DishService } from '../../services/dish.service';
import { AuthService } from '../../services/auth.service';
import { Dish } from '../../models/dish.model';

@Component({
  selector: 'app-add-dish',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-dish.html',
  styleUrl: './add-dish.scss'
})
export class AddDishComponent {
  @Output() saved = new EventEmitter<Dish>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;
  loading = signal(false);
  error = signal('');

  get isRestaurant() { return this.auth.currentUser()?.seller_type === 'restaurant'; }

  constructor(private fb: FormBuilder, private dishService: DishService, public auth: AuthService) {
    this.form = this.fb.group({
      name:             ['', Validators.required],
      quantity:         [1, [Validators.required, Validators.min(1)]],
      quantity_size:    ['', [Validators.required, Validators.min(0.1)]],
      quantity_unit:    ['grams', Validators.required],
      whats_special:    [''],
      price:            ['', [Validators.required, Validators.min(0)]],
      discount_percent: [null]
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');

    const value = { ...this.form.value };
    if (!this.isRestaurant) delete value.discount_percent;

    this.dishService.addDish(value).subscribe({
      next: dish => { this.loading.set(false); this.saved.emit(dish); },
      error: err => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to add dish');
      }
    });
  }
}
