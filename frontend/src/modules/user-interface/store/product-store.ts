import { create } from 'zustand';
import { Product, Store } from '../types';
import { productService } from '../services/product-service';

export const useStore = create<Store>((set) => ({
  products: [],
  cart: [],

  fetchProducts: async () => {
    const products = await productService.fetchProducts();
    set({ products });
    return products;
  },

  fetchCart: async () => {
    const cart = await productService.fetchCart();
    set({ cart });
    return cart;
  },

  addToCart: async (product: Product) => {
    if (product.stock_quantity <= 0) {
      throw new Error('Товар отсутствует на складе');
    }
    const cart = await productService.addToCart(product.id);
    set({ cart });
    return cart;
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    const cart = await productService.updateQuantity(itemId, quantity);
    set({ cart });
    return cart;
  },

  removeFromCart: async (itemId: number) => {
    const cart = await productService.removeFromCart(itemId);
    set({ cart });
    return cart;
  }
})); 