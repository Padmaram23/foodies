import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-seller-type-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seller-type-picker.html',
  styleUrl: './seller-type-picker.scss'
})
export class SellerTypePickerComponent {
  @Output() cancelled = new EventEmitter<void>();
  @Output() registered = new EventEmitter<void>();

  form: FormGroup;
  loading = signal(false);
  error = signal('');

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({ seller_type: ['', Validators.required] });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.userService.becomeSeller(this.form.value.seller_type).subscribe({
      next: () => {
        this.loading.set(false);
        this.registered.emit();
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to register as seller');
      }
    });
  }
}
