import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {{ auth.currentUser()?.email }}</p>
      <p class="role-badge admin">Role: Admin</p>
      <button (click)="logout()">Logout</button>
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem; font-family: sans-serif; }
    .role-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.85rem; font-weight: 600; }
    .admin { background: #ede9fe; color: #6d28d9; }
    button { margin-top: 1.5rem; padding: 0.5rem 1.25rem; background: #6366f1; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
  `]
})
export class AdminDashboardComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
