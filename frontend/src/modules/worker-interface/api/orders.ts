import { Order, OrderStatus } from '../../../types/order';
import api from '../../auth/api/api';

const STATUS_TO_ID: Record<OrderStatus, number> = {
  'Created': 1,
  'Worked': 2,
  'Ready': 3,
  'Issued': 4
};

export const ordersApi = {
  async getAllOrders(): Promise<Order[]> {
    const response = await api.get('/api/orders/all');
    return response.data;
  },

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const statusId = STATUS_TO_ID[status];
    const response = await api.get(`/api/orders/status/${statusId}`);
    return response.data;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const statusId = STATUS_TO_ID[status];
    const response = await api.patch(`/api/orders/${orderId}/status`, { status_id: statusId });
    return response.data;
  },
}; 