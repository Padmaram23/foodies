export interface CartItem {
  dish_id: string;
  dish_name: string;
  unit_price: number;
  quantity: number;
  available_quantity: number;
  discount_percent?: number;
}

export interface OrderItem {
  id: string;
  dish_id: string;
  dish_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  seller_id?: string;
  seller_name?: string;
  seller_type?: 'homemade' | 'restaurant';
  seller_phone?: string;
  seller_email?: string;
}

export interface Order {
  id: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  total_amount: number;
  seller_total?: number;
  stripe_payment_intent_id: string;
  client_secret: string;
  stripe_publishable_key: string;
  items: OrderItem[];
  created_at: string;
}
