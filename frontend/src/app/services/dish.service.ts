import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Dish, CreateDishRequest, DishSettings } from '../models/dish.model';

@Injectable({ providedIn: 'root' })
export class DishService {
  private readonly API = `${environment.apiUrl}/dishes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getMyDishes() {
    return this.http.get<Dish[]>(this.API, { headers: this.headers() });
  }

  getAvailableDishes() {
    return this.http.get<Dish[]>(`${this.API}/available`, { headers: this.headers() });
  }

  addDish(data: CreateDishRequest) {
    return this.http.post<Dish>(this.API, data, { headers: this.headers() });
  }

  deleteDish(id: string) {
    return this.http.delete(`${this.API}/${id}`, { headers: this.headers() });
  }

  getSettings() {
    return this.http.get<DishSettings>(`${this.API}/settings`, { headers: this.headers() });
  }

  updateSettings(expiry_minutes: number) {
    return this.http.put<DishSettings>(`${this.API}/settings`, { expiry_minutes }, { headers: this.headers() });
  }
}
