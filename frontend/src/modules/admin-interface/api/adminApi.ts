import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/admin`;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const adminApi = {
  // Заказы
  getActiveOrders: async () => {
    const response = await axios.get(`${API_URL}/orders/active`, {
      headers: getAuthHeader()
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  getOrderHistory: async () => {
    const response = await axios.get(`${API_URL}/orders/history`, {
      headers: getAuthHeader()
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  // Пользователи
  getUsers: async () => {
    const response = await axios.get(`${API_URL}/users`, {
      headers: getAuthHeader()
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  updateUser: async (userId: number, userData: { 
    name: string; 
    login: string;
    role: string;
    birth_date: string;
  }) => {
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      userData,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  },

  // Товары
  getProducts: async () => {
    const response = await axios.get(`${API_URL}/products`, {
      headers: getAuthHeader()
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  updateProduct: async (productId: number, productData: {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url: string;
  }) => {
    const response = await axios.put(
      `${API_URL}/products/${productId}`,
      productData,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  },

  createProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url: string;
  }) => {
    const response = await axios.post(
      `${API_URL}/products`,
      productData,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  },

  deleteProduct: async (productId: number) => {
    const response = await axios.delete(
      `${API_URL}/products/${productId}`,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  }
}; 