import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly PROFILE_API = `${environment.apiUrl}/user/profile`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  currentUser = signal<User | null>(this._loadUser());

  constructor(private http: HttpClient) {}

  /** Update currentUser signal AND persist to localStorage */
  setUser(user: User | null) {
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUser.set(user);
  }

  /** Fetch fresh profile from API and update state */
  refreshProfile() {
    return this.http.get<User>(this.PROFILE_API, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` })
    }).pipe(tap(user => this.setUser(user)));
  }

  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.API}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.setUser(res.user);
      })
    );
  }

  register(data: RegisterRequest) {
    return this.http.post<User>(`${this.API}/register`, data);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.setUser(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }

  private _loadUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
