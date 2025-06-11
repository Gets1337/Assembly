import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
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

export const authAPI = {
  login: async (login: string, password: string) => {
    const response = await api.post('/api/auth/login', { login, password });
    return response.data;
  },
  
  register: async (userData: {
    login: string;
    password: string;
    full_name: string;
    birth_date: string;
  }) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  checkAuth: async () => {
    const response = await api.get('/api/auth/check');
    return response.data;
  },
};

export default api; 