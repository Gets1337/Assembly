import { create } from 'zustand';
import { Order, OrderStatus } from '../types/order';
import { ordersApi } from '../modules/worker-interface/api/orders';

interface OrderStore {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  fetchOrdersByStatus: (status: OrderStatus) => Promise<void>;
  updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],

  fetchOrders: async () => {
    const orders = await ordersApi.getAllOrders();
    set({ orders });
  },

  fetchOrdersByStatus: async (status: OrderStatus) => {
    const orders = await ordersApi.getOrdersByStatus(status);
    set({ orders });
  },

  updateOrderStatus: async (orderId: number, status: OrderStatus) => {
    await ordersApi.updateOrderStatus(orderId.toString(), status);
    const orders = await ordersApi.getOrdersByStatus(status);
    set({ orders });
  }
})); 