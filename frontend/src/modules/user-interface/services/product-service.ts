import { api } from '../api/productApi';
import { Product, CartItem } from '../types';

export const productService = {
  async fetchProducts(): Promise<Product[]> {
    const response = await api.get('/api/products');
    return response.data;
  },

  async fetchCart(): Promise<CartItem[]> {
    const response = await api.get('/api/cart');
    const cartItems = response.data.items || [];
    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item: any) => {
        const productResponse = await api.get(`/api/products/${item.product_id}`);
        return {
          ...item,
          product: productResponse.data
        };
      })
    );
    
    return itemsWithProducts;
  },

  async addToCart(productId: number): Promise<CartItem[]> {
    const response = await api.post('/api/cart/items', {
      productId,
      quantity: 1
    });
    return response.data.items || [];
  },

  async updateQuantity(itemId: number, quantity: number): Promise<CartItem[]> {
    await api.put(`/api/cart/items/${itemId}`, { quantity });
    const response = await api.get('/api/cart');
    const cartItems = response.data.items || [];
    
    // Получаем полные данные о продуктах
    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item: any) => {
        const productResponse = await api.get(`/api/products/${item.product_id}`);
        return {
          ...item,
          product: productResponse.data
        };
      })
    );
    
    return itemsWithProducts;
  },

  async removeFromCart(itemId: number): Promise<CartItem[]> {
    await api.delete(`/api/cart/items/${itemId}`);
    const response = await api.get('/api/cart');
    return response.data.items || [];
  }
}; 