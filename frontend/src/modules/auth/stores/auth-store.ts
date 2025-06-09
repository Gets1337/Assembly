import { create } from 'zustand';
import { authAPI } from '../api';
import { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.checkAuth();
        const userData: User = {
          id: response.user.id,
          login: response.user.login,
          full_name: response.user.full_name,
          birth_date: response.user.birth_date,
          role: response.user.role
        };
        set({ user: userData, isLoading: false });
      } catch (error) {
        localStorage.removeItem('token');
        set({ user: null, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  login: async (login: string, password: string) => {
    try {
      const response = await authAPI.login(login, password);
      if (!response.token) {
        throw new Error('Ошибка при входе');
      }
      
      const userData: User = {
        id: response.user.id,
        login: response.user.login,
        full_name: response.user.full_name,
        birth_date: response.user.birth_date,
        role: response.user.role
      };
      
      localStorage.setItem('token', response.token);
      set({ user: userData });
    } catch (error) {
      throw error;
    }
  },

  register: async (login: string, password: string, full_name: string, birth_date: string) => {
    try {
      const response = await authAPI.register({
        login,
        password,
        full_name,
        birth_date,
      });
      
      if (response.token) {
        const userData: User = {
          id: response.user.id,
          login: response.user.login,
          full_name: response.user.full_name,
          birth_date: response.user.birth_date,
          role: response.user.role
        };
        
        localStorage.setItem('token', response.token);
        set({ user: userData });
      }
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem('token');
  },
}));  