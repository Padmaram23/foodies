import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup').then(m => m.SignupComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/user-dashboard/user-dashboard').then(m => m.UserDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'sell',
        loadComponent: () => import('./components/sell/sell').then(m => m.SellComponent)
      },
      {
        path: 'become-seller',
        loadComponent: () => import('./components/become-seller/become-seller').then(m => m.BecomeSellerComponent)
      },
      {
        path: 'admin/dashboard',
        loadComponent: () => import('./components/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent)
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
  },
  { path: '**', redirectTo: 'login' }
];
