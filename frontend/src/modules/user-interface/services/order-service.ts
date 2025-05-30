import { api } from '../api/productApi';
import { Order, CartItem } from '../types';

export const orderService = {
  async createOrder(): Promise<Order> {
    try {
      const cartResponse = await api.get('/api/cart');
      const cartItems: CartItem[] = cartResponse.data.items || [];
      
      if (cartItems.length === 0) {
        throw new Error('Корзина пуста');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Пользователь не авторизован');
      }

      let userId: number;
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Некорректный формат токена');
        }

        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        userId = tokenPayload.userId || tokenPayload.user_id || tokenPayload.id;
        
        if (!userId || typeof userId !== 'number') {
          throw new Error('Некорректный ID пользователя в токене');
        }
      } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        throw new Error('Ошибка при получении данных пользователя');
      }

      const validCartItems = cartItems.filter(item => 
        item.product && 
        typeof item.product.id === 'number' && 
        typeof item.quantity === 'number' && 
        item.quantity > 0
      );

      if (validCartItems.length === 0) {
        throw new Error('Некорректные данные в корзине');
      }

      const orderData = {
        items: validCartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        })),
        user_id: userId
      };
      try {
        const response = await api.post('/api/orders', orderData);
        return response.data;
      } catch (error: any) {
        console.error('Детали ошибки:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });

        if (error.response) {
          const errorMessage = error.response.data?.message || error.response.statusText;
          throw new Error(`Ошибка сервера: ${errorMessage}`);
        } else if (error.request) {
          throw new Error('Нет ответа от сервера');
        } else {
          throw new Error(`Ошибка запроса: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      throw error;
    }
  },

  async getOrders(): Promise<Order[]> {
    const response = await api.get('/api/orders/my');
    return response.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  }
}; 