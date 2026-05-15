# Foodies — Frontend

Angular SPA for the Foodies platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 |
| Language | TypeScript |
| Styling | SCSS |
| Forms | Reactive Forms |
| HTTP | Angular HttpClient |
| Routing | Angular Router |
| State | Angular Signals |
| Auth | JWT stored in localStorage |

## Project Structure

```
frontend/src/app/
├── components/
│   ├── login/               # Login page (email or phone)
│   ├── signup/              # Registration page
│   ├── navbar/              # Side navigation
│   ├── layout/              # Authenticated shell (navbar + router outlet)
│   ├── user-dashboard/      # Home — browse available dishes
│   ├── profile/             # View/edit profile, become a seller
│   ├── sell/                # Seller dashboard — dish listings grouped by date
│   ├── add-dish/            # Add dish form
│   ├── become-seller/       # Seller type selection page
│   ├── seller-type-picker/  # Reusable homemade/restaurant picker
│   ├── confirm-dialog/      # Reusable confirmation modal
│   ├── admin-dashboard/     # Admin home
│   └── unauthorized/        # 403 page
├── guards/
│   └── auth.guard.ts        # authGuard + roleGuard
├── interceptors/
│   └── auth.interceptor.ts  # Catches 419 → logout + redirect to login
├── models/
│   ├── auth.model.ts        # LoginRequest, RegisterRequest, User, LoginResponse
│   └── dish.model.ts        # Dish, CreateDishRequest, DishSettings
├── services/
│   ├── auth.service.ts      # Login, register, logout, token management
│   ├── user.service.ts      # Profile update, become seller
│   └── dish.service.ts      # Dish CRUD, available dishes, expiry settings
└── environments/
    ├── environment.ts        # Dev config (appName, apiUrl)
    └── environment.prod.ts   # Prod config
```

## Environment Configuration

All app-wide constants live in `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  appName: 'Foodies',       // Change app name here
  apiUrl: 'http://localhost:5000/api'
};
```

For production builds, update `environment.prod.ts`.

## Setup

```bash
nvm use 22
npm install
```

## Running

```bash
ng serve                    # dev server on http://localhost:4200
```

## Building for Production

```bash
ng build                    # output in dist/
```

## Key Conventions

- All components are standalone (no NgModules)
- App state uses Angular Signals (`signal()`, `computed()`)
- API base URL and app name come from `environment.ts` — never hardcoded
- HTTP 419 from the backend (expired JWT) is caught by `authInterceptor` → auto logout + redirect to `/login?reason=session_expired`
- Route guards: `authGuard` (must be logged in), `roleGuard(role)` (role check)
- Authenticated pages use the `LayoutComponent` shell which includes the side navbar

## Routing Overview

| Path | Guard | Component |
|---|---|---|
| `/login` | — | LoginComponent |
| `/signup` | — | SignupComponent |
| `/dashboard` | auth | UserDashboardComponent |
| `/profile` | auth | ProfileComponent |
| `/sell` | auth | SellComponent |
| `/become-seller` | auth | BecomeSellerComponent |
| `/admin/dashboard` | auth | AdminDashboardComponent |
| `/unauthorized` | — | UnauthorizedComponent |
