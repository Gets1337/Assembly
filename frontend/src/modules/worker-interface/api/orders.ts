import { Order, OrderStatus } from '../../../types/order';
import api from '../../auth/api/api';

export const ordersApi = {
  async getAllOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data;
  },

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const response = await api.get('/orders');
    const orders = response.data;
    return orders.filter((order: Order) => order.status.name === status);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },
}; 