import { create } from 'zustand';
import { User, Order, Product } from '../types';
import { adminApi } from '../api/adminApi';

interface AdminState {
  // Состояние
  users: User[];
  activeOrders: Order[];
  orderHistory: Order[];
  products: Product[];
  isLoading: {
    users: boolean;
    activeOrders: boolean;
    orderHistory: boolean;
    products: boolean;
  };
  error: {
    users: string | null;
    activeOrders: string | null;
    orderHistory: string | null;
    products: string | null;
  };

  fetchUsers: () => Promise<void>;
  fetchActiveOrders: () => Promise<void>;
  fetchOrderHistory: () => Promise<void>;
  updateOrderStatus: (orderId: number, status: string) => Promise<void>;
  updateUser: (userId: number, userData: { 
    name: string; 
    login: string;
    role: string;
    birth_date: string;
  }) => Promise<void>;

  fetchProducts: () => Promise<void>;
  updateProduct: (productId: number, productData: {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url: string;
  }) => Promise<void>;
  createProduct: (productData: {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url: string;
  }) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;

  createUser: (userData: { 
    name: string; 
    login: string;
    password: string;
    role: string;
    birth_date: string;
  }) => Promise<void>;

  deleteUser: (userId: number) => Promise<void>;

  deleteOrder: (orderId: number) => Promise<void>;
  updateOrder: (orderId: number, orderData: {
    status_name?: string;
    payment_method?: string;
    total_amount?: number;
  }) => Promise<void>;
  updateOrderProducts: (orderId: number, products: Array<{
    product_id: number;
    quantity: number;
  }>) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  activeOrders: [],
  orderHistory: [],
  products: [],
  isLoading: {
    users: false,
    activeOrders: false,
    orderHistory: false,
    products: false
  },
  error: {
    users: null,
    activeOrders: null,
    orderHistory: null,
    products: null
  },

  fetchUsers: async () => {
    set((state) => ({
      isLoading: { ...state.isLoading, users: true },
      error: { ...state.error, users: null }
    }));

    try {
      const users = await adminApi.getUsers();
      set((state) => ({
        users,
        isLoading: { ...state.isLoading, users: false }
      }));
    } catch (error) {
      set((state) => ({
        error: { ...state.error, users: 'Ошибка при загрузке пользователей' },
        isLoading: { ...state.isLoading, users: false }
      }));
    }
  },

  fetchActiveOrders: async () => {
    set((state) => ({
      isLoading: { ...state.isLoading, activeOrders: true },
      error: { ...state.error, activeOrders: null }
    }));

    try {
      const orders = await adminApi.getActiveOrders();
      set((state) => ({
        activeOrders: orders,
        isLoading: { ...state.isLoading, activeOrders: false }
      }));
    } catch (error) {
      set((state) => ({
        error: { ...state.error, activeOrders: 'Ошибка при загрузке активных заказов' },
        isLoading: { ...state.isLoading, activeOrders: false }
      }));
    }
  },

  fetchOrderHistory: async () => {
    set((state) => ({
      isLoading: { ...state.isLoading, orderHistory: true },
      error: { ...state.error, orderHistory: null }
    }));

    try {
      const orders = await adminApi.getOrderHistory();
      set((state) => ({
        orderHistory: orders,
        isLoading: { ...state.isLoading, orderHistory: false }
      }));
    } catch (error) {
      set((state) => ({
        error: { ...state.error, orderHistory: 'Ошибка при загрузке истории заказов' },
        isLoading: { ...state.isLoading, orderHistory: false }
      }));
    }
  },

  updateOrderStatus: async (orderId: number, status: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      const orders = await adminApi.getActiveOrders();
      set({ activeOrders: orders });
    } catch (error) {
      set((state) => ({
        error: { ...state.error, activeOrders: 'Ошибка при обновлении статуса заказа' }
      }));
    }
  },

  updateUser: async (userId: number, userData: { 
    name: string; 
    login: string;
    role: string;
    birth_date: string;
  }) => {
    try {
      await adminApi.updateUser(userId, userData);
      const users = await adminApi.getUsers();
      set({ users });
    } catch (error) {
      set((state) => ({
        error: { ...state.error, users: 'Ошибка при обновлении пользователя' }
      }));
    }
  },

  fetchProducts: async () => {
    set((state) => ({
      isLoading: { ...state.isLoading, products: true },
      error: { ...state.error, products: null }
    }));

    try {
      const products = await adminApi.getProducts();
      set((state) => ({
        products,
        isLoading: { ...state.isLoading, products: false }
      }));
    } catch (error) {
      set((state) => ({
        error: { ...state.error, products: 'Ошибка при загрузке товаров' },
        isLoading: { ...state.isLoading, products: false }
      }));
    }
  },

  updateProduct: async (productId: number, productData) => {
    try {
      await adminApi.updateProduct(productId, productData);
      const products = await adminApi.getProducts();
      set({ products });
    } catch (error) {
      set((state) => ({
        error: { ...state.error, products: 'Ошибка при обновлении товара' }
      }));
    }
  },

  createProduct: async (productData) => {
    try {
      await adminApi.createProduct(productData);
      const products = await adminApi.getProducts();
      set({ products });
    } catch (error) {
      set((state) => ({
        error: { ...state.error, products: 'Ошибка при создании товара' }
      }));
    }
  },

  deleteProduct: async (productId: number) => {
    try {
      await adminApi.deleteProduct(productId);
      const products = await adminApi.getProducts();
      set({ products });
    } catch (error) {
      set((state) => ({
        error: { ...state.error, products: 'Ошибка при удалении товара' }
      }));
    }
  },

  createUser: async (userData) => {
    try {
      await adminApi.createUser(userData);
      const users = await adminApi.getUsers();
      set({ users });
    } catch (error) {
      set((state) => ({
        error: { ...state.error, users: 'Ошибка при создании пользователя' }
      }));
    }
  },

  deleteUser: async (userId) => {
    try {
      await adminApi.deleteUser(userId);
      const users = await adminApi.getUsers();
      set({ users });
    } catch (error) {
      set((state) => ({
        error: { ...state.error, users: 'Ошибка при удалении пользователя' }
      }));
    }
  },

  deleteOrder: async (orderId: number) => {
    try {
      await adminApi.deleteOrder(orderId);
      const orders = await adminApi.getActiveOrders();
      set({ activeOrders: orders });
    } catch (error) {
      set((state) => ({
        error: { ...state.error, activeOrders: 'Ошибка при удалении заказа' }
      }));
    }
  },

  updateOrder: async (orderId: number, orderData: {
    status_name?: string;
    payment_method?: string;
    total_amount?: number;
  }) => {
    try {
      await adminApi.updateOrder(orderId, orderData);
      const orders = await adminApi.getActiveOrders();
      set({ activeOrders: orders });
    } catch (error) {
      set((state) => ({
        error: { ...state.error, activeOrders: 'Ошибка при обновлении заказа' }
      }));
    }
  },

  updateOrderProducts: async (orderId: number, products: Array<{
    product_id: number;
    quantity: number;
  }>) => {
    try {
      await adminApi.updateOrderProducts(orderId, products);
      const orders = await adminApi.getActiveOrders();
      set({ activeOrders: orders });
    } catch (error) {
      set((state) => ({
        error: { ...state.error, activeOrders: 'Ошибка при обновлении товаров в заказе' }
      }));
    }
  }
})); 