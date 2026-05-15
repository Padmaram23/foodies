import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="padding:2rem;font-family:sans-serif;text-align:center">
      <h1>403 — Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
      <a routerLink="/login">Back to Login</a>
    </div>
  `
})
export class UnauthorizedComponent {}
