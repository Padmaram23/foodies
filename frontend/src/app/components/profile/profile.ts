import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  saving = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  editing = signal(false);

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    const u = this.auth.currentUser();
    this.form = this.fb.group({
      name:  [u?.name  || '', Validators.required],
      email: [u?.email || '', [Validators.required, Validators.email]],
      phone: [u?.phone || '', Validators.pattern(/^\+?[0-9]{7,15}$/)]
    });
  }

  onSave() {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');

    this.userService.updateProfile(this.form.value).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.successMsg.set('Profile updated successfully');
      },
      error: err => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message || 'Update failed');
      }
    });
  }

  get isSeller() { return this.auth.currentUser()?.is_seller; }
  get isAdmin()  { return this.auth.currentUser()?.role === 'admin'; }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
