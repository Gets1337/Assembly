export interface AuthUser {
  login: string;
  full_name: string;
  birth_date: string;
}

export interface AuthStore {
  user: AuthUser | null;
  isAuth: boolean;
  register: (login: string, password: string, full_name: string, birth_date: string) => Promise<void>;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface User {
    id: number;
    login: string;
    full_name: string;
    birth_date: string;
    role: string;
  }
  
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (login: string, password: string) => Promise<void>;
    register: (login: string, password: string, full_name: string, birth_date: string) => Promise<void>;
    logout: () => void;
    initializeAuth: () => Promise<void>;
  }

