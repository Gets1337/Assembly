export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
  }
  
export interface CartItem extends Product {
    quantity: number;
  }
  
export interface Store {
    products: Product[];
    cart: CartItem[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    addToCart: (product: Product) => void;
    updateQuantity: (id: number, quantity: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
  }

export interface ProductCardProps {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    onAddToCart: (productId: number) => void;
  }

export interface UIStore {
    activeTab: number;
    setActiveTab: (tab: number) => void;
    isUserMenuOpen: boolean;
    setUserMenuOpen: (isOpen: boolean) => void;
    anchorEl: HTMLElement | null;
    setAnchorEl: (element: HTMLElement | null) => void;
  }