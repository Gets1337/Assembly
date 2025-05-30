import { create } from 'zustand';
import { Order, OrderStatus } from '../types/order';
import { ordersApi } from '../modules/worker-interface/api/orders';

interface OrderStore {
  ordersByStatus: Record<OrderStatus, Order[]>;
  fetchOrders: () => Promise<void>;
  fetchOrdersByStatus: (status: OrderStatus) => Promise<void>;
  updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<void>;
}

const initialOrdersByStatus: Record<OrderStatus, Order[]> = {
  'Created': [],
  'Worked': [],
  'Ready': [],
  'Issued': []
};

export const useOrderStore = create<OrderStore>((set) => ({
  ordersByStatus: initialOrdersByStatus,

  fetchOrders: async () => {
    const orders = await ordersApi.getAllOrders();
    const ordersByStatus = orders.reduce((acc, order) => {
      const status = order.status.name as OrderStatus;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(order);
      return acc;
    }, { ...initialOrdersByStatus });
    set({ ordersByStatus });
  },

  fetchOrdersByStatus: async (status: OrderStatus) => {
    const orders = await ordersApi.getOrdersByStatus(status);
    set((state) => ({
      ordersByStatus: {
        ...state.ordersByStatus,
        [status]: orders
      }
    }));
  },

  updateOrderStatus: async (orderId: number, status: OrderStatus) => {
    await ordersApi.updateOrderStatus(orderId.toString(), status);
    const orders = await ordersApi.getOrdersByStatus(status);
    set((state) => ({
      ordersByStatus: {
        ...state.ordersByStatus,
        [status]: orders
      }
    }));
  }
})); 