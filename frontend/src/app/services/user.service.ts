import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/auth.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getProfile() {
    return this.http.get<User>(`${this.API}/profile`, { headers: this.headers() });
  }

  updateProfile(data: Partial<User>) {
    return this.http.put<User>(`${this.API}/profile`, data, { headers: this.headers() }).pipe(
      tap(user => this.auth.currentUser.set(user))
    );
  }

  becomeSeller(seller_type: string, business_name: string, address: string) {
    return this.http.post<User>(
      `${this.API}/become-seller`,
      { seller_type, business_name, address },
      { headers: this.headers() }
    ).pipe(tap(user => this.auth.currentUser.set(user)));
  }
}
