export type OrderStatus = 'Created' | 'Worked' | 'Ready' | 'Issued';

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  stock_quantity: number;
}

export interface ProductInOrder {
  id: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  status_id: number;
  status: {
    id: number;
    name: OrderStatus;
  };
  payment_method: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  products: ProductInOrder[];
} 