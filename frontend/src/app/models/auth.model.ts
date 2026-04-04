export interface LoginRequest {
  identifier: string; // email or phone
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'seller';
  is_seller: boolean;
  seller_type?: 'homemade' | 'restaurant';
}

export interface LoginResponse {
  token: string;
  user: User;
}
