import { create } from 'zustand';
import { authAPI } from '../services/api';

interface User {
  id: number;
  login: string;
  fullName: string;
  birthDate: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<void>;
  register: (login: string, password: string, fullName: string, birthDate: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (login: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(login, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: 'Ошибка при входе', isLoading: false });
    }
  },

  register: async (login: string, password: string, fullName: string, birthDate: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register({
        login,
        password,
        fullName,
        birthDate,
      });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: 'Ошибка при регистрации', isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('token');
  },
})); 