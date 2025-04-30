import { create } from 'zustand';
import { authAPI } from '../api/api';
import { AuthState } from '../types';

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

        const expirationTime = Date.now() + 20 * 60 * 1000; 
        localStorage.setItem('tokenExpiration', expirationTime.toString());

        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
          set({ user: null, isAuthenticated: false });
        }, 20 * 60 * 1000);
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

        const expirationTime = Date.now() + 20 * 60 * 1000; 
        localStorage.setItem('tokenExpiration', expirationTime.toString());

        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
          set({ user: null, isAuthenticated: false });
        }, 20 * 60 * 1000); 
      }
      
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: 'Ошибка при регистрации', isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
  },
})); 