import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface EarningsHistory { key: string; label: string; total: number; }
export interface Earnings {
  this_month: number;
  this_month_label: string;
  history: EarningsHistory[];
}

@Injectable({ providedIn: 'root' })
export class EarningsService {
  private readonly API = `${environment.apiUrl}/earnings`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getEarnings() {
    return this.http.get<Earnings>(this.API, { headers: this.headers() });
  }
}
