import { create } from 'zustand';
import { productApi } from '../api/productApi';
import { Store } from '../types'

export const useStore = create<Store>((set, get) => ({
  products: [],
  cart: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await productApi.getAllProducts();
      set({ products, isLoading: false });
    } catch (error) {
      set({ error: 'Ошибка при загрузке товаров', isLoading: false });
    }
  },

  addToCart: (product) => {
    const cart = get().cart;
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },

  updateQuantity: (id, quantity) => {
    if (quantity < 1) return;
    set({
      cart: get().cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    });
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter((item) => item.id !== id) });
  },

  clearCart: () => {
    set({ cart: [] });
  },
})); 