export interface ProductCardProps {
    product: Product;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock_quantity: number;
    category: string;
}

export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}

export interface CartProps {
    onCheckout: () => void;
}

export interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (itemId: number, quantity: number) => Promise<void>;
    onRemoveItem: (itemId: number) => Promise<void>;
}

export interface Store {
    products: Product[];
    cart: CartItem[];
    fetchProducts: () => Promise<Product[]>;
    fetchCart: () => Promise<CartItem[]>;
    addToCart: (product: Product) => Promise<CartItem[]>;
    updateQuantity: (itemId: number, quantity: number) => Promise<CartItem[]>;
    removeFromCart: (itemId: number) => Promise<CartItem[]>;
}

export interface UIStore {
    activeTab: number;
    setActiveTab: (tab: number) => void;
    isUserMenuOpen: boolean;
    setUserMenuOpen: (isOpen: boolean) => void;
    anchorEl: HTMLElement | null;
    setAnchorEl: (element: HTMLElement | null) => void;
}

export interface CreateOrderRequest {
  items: {
    product_id: number;
    quantity: number;
  }[];
  user_id: number;
  payment_method: 'cash';
}

export interface Order {
  id: number;
  user_id: number;
  status: {
    id: number;
    name: string;
  };
  total_amount: number;
  created_at: string;
  payment_method: 'card' | 'cash';
  products: {
    id: number;
    product: Product;
    quantity: number;
  }[];
}

export interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  totalAmount: number;
}

export interface ProductInOrder {
  id: number;
  product: Product;
  quantity: number;
}

export const ORDER_STATUS = {
  CREATED: 'Создан',
  WORKED: 'В работе',
  READY: 'Готов к выдаче',
  ISSUED: 'Выдан',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]; 

  