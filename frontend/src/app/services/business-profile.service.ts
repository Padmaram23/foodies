import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface BusinessProfile {
  id?: string;
  seller_id?: string;
  business_name: string;
  address: string;
  seller_type?: 'homemade' | 'restaurant';
}

@Injectable({ providedIn: 'root' })
export class BusinessProfileService {
  private readonly API = `${environment.apiUrl}/business-profile`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getProfile() {
    return this.http.get<BusinessProfile>(this.API, { headers: this.headers() });
  }

  saveProfile(data: BusinessProfile) {
    return this.http.post<BusinessProfile>(this.API, data, { headers: this.headers() });
  }
}
