import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Review, ReviewableItem, BusinessReviews } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly API = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  submitReview(data: { order_id: string; dish_id: string; rating: number; comment?: string }) {
    return this.http.post<Review>(this.API, data, { headers: this.headers() });
  }

  getReviewableItems() {
    return this.http.get<ReviewableItem[]>(`${this.API}/reviewable`, { headers: this.headers() });
  }

  getDishReviews(dishId: string) {
    return this.http.get<Review[]>(`${this.API}/dish/${dishId}`);
  }

  getBusinessReviews(businessProfileId: string) {
    return this.http.get<BusinessReviews>(`${this.API}/business/${businessProfileId}`);
  }
}
