import axios from 'axios';

const API_URL = `${window.location.protocol}//${window.location.host}:3000`;

export const api = axios.create({
  baseURL: API_URL,
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

export const productApi = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id: number, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    await api.delete(`/products/${id}`);
  },
}; 