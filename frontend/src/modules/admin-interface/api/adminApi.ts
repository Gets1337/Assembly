import axios from 'axios';

const BASE_URL = `${window.location.protocol}//${window.location.host}:3000`;


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  // Заказы
  getActiveOrders: async () => {
    const response = await api.get('/api/admin/orders/active');
    return Array.isArray(response.data) ? response.data : [];
  },

  getOrderHistory: async () => {
    const response = await api.get('/api/admin/orders/history');
    return Array.isArray(response.data) ? response.data : [];
  },

  updateOrderStatus: async (orderId: number, status: string) => {
    const response = await api.patch(`/api/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Пользователи
  getUsers: async () => {
    const response = await api.get('/api/admin/users');
    return Array.isArray(response.data) ? response.data : [];
  },

  updateUser: async (userId: number, userData: { 
    name: string; 
    login: string;
    role: string;
    birth_date: string;
  }) => {
    const response = await api.put(`/api/admin/users/${userId}`, userData);
    return response.data;
  },

  // Товары
  getProducts: async () => {
    const response = await api.get('/api/admin/products');
    return Array.isArray(response.data) ? response.data : [];
  },

  updateProduct: async (productId: number, productData: {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url: string;
  }) => {
    const response = await api.put(`/api/admin/products/${productId}`, productData);
    return response.data;
  },

  createProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url: string;
  }) => {
    const response = await api.post('/api/admin/products', productData);
    return response.data;
  },

  deleteProduct: async (productId: number) => {
    const response = await api.delete(`/api/admin/products/${productId}`);
    return response.data;
  }
}; 