import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const productApi = {
  getAllProducts: async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
  },

  updateProduct: async (id: number, productData: any) => {
    const response = await axios.put(`${API_URL}/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    await axios.delete(`${API_URL}/products/${id}`);
  },
}; 