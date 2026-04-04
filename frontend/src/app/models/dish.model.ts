export interface Dish {
  id: string;
  seller_id: string;
  seller_name?: string;
  seller_type?: 'homemade' | 'restaurant';
  name: string;
  quantity: number;
  quantity_size: number;
  quantity_unit: 'grams' | 'kg';
  whats_special?: string;
  price: number;
  discount_percent?: number;
  discounted_price?: number;
  created_at: string;
  expires_at: string | null;
  is_expired: boolean;
}

export interface CreateDishRequest {
  name: string;
  quantity: number;
  quantity_size: number;
  quantity_unit: 'grams' | 'kg';
  whats_special?: string;
  price: number;
  discount_percent?: number;
}

export interface DishSettings {
  seller_id: string;
  expiry_minutes: number;
}
