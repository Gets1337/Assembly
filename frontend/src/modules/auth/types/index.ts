export interface User {
    id: number;
    login: string;
    fullName: string;
    birthDate: string;
    role: string;
  }
  
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (login: string, password: string) => Promise<void>;
    register: (login: string, password: string, fullName: string, birthDate: string) => Promise<void>;
    logout: () => void;
  }

