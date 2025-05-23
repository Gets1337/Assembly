import { create } from 'zustand';
import { authAPI } from '../api';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: async (login: string, password: string) => {
    try {
      const response = await authAPI.login(login, password);
      if (!response.token) {
        throw new Error('Ошибка при входе');
      }
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      set({ user: response.user });
    } catch (error) {
      throw error;
    }
  },

  register: async (login: string, password: string, fullName: string, birthDate: string) => {
    try {
      const response = await authAPI.register({
        login,
        password,
        fullName,
        birthDate,
      });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.user.role);
      }
      
      set({ user: response.user });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  },
}));  