import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  form: FormGroup;
  error = signal('');
  loading = signal(false);
  showPassword = signal(false);
  appName = environment.appName;
  sessionExpired = signal(false);

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.sessionExpired.set(this.route.snapshot.queryParams['reason'] === 'session_expired');
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.form.value).subscribe({
      next: res => {
        this.loading.set(false);
        const { role, is_seller } = res.user;
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (is_seller) {
          this.router.navigate(['/sell']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Login failed');
      }
    });
  }
}
