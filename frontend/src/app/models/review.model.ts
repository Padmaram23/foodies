export interface Review {
  id: string;
  order_id: string;
  buyer_id: string;
  buyer_name?: string;
  dish_id: string;
  dish_name?: string;
  business_profile_id: string;
  business_name?: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ReviewableItem {
  order_id: string;
  dish_id: string;
  dish_name: string;
  business_name?: string;
  ordered_at: string;
}

export interface BusinessReviews {
  reviews: Review[];
  average_rating: number | null;
  count: number;
}
