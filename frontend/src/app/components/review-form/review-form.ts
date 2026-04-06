import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { ReviewableItem } from '../../models/review.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-form.html',
  styleUrl: './review-form.scss'
})
export class ReviewFormComponent {
  @Input() item!: ReviewableItem;
  @Output() submitted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  stars = [1, 2, 3, 4, 5];
  rating = signal(0);
  hovered = signal(0);
  comment = '';
  loading = signal(false);
  error = signal('');

  constructor(private reviewService: ReviewService) {}

  submit() {
    if (this.rating() === 0) { this.error.set('Please select a rating'); return; }
    this.loading.set(true);
    this.error.set('');

    this.reviewService.submitReview({
      order_id: this.item.order_id,
      dish_id: this.item.dish_id,
      rating: this.rating(),
      comment: this.comment || undefined
    }).subscribe({
      next: () => { this.loading.set(false); this.submitted.emit(); },
      error: err => { this.loading.set(false); this.error.set(err.error?.message || 'Failed to submit review'); }
    });
  }
}
