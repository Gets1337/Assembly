export interface User {
  id: number;
  full_name: string;
  login: string;
  role: {
    id: number;
    name: string;
  };
  birth_date: string;
  created_at: string;
}

export interface OrderStatus {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  created_at: string;
  updated_at: string | null;
} 

export interface ProductInOrder {
  id: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  payment_method: string;
  total_amount: number;
  user: {
    full_name: string;
    login: string;
  };
  products: ProductInOrder[];
} 