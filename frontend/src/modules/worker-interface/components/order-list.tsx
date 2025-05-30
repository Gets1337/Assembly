import { Box, Typography, Button, List, ListItem, ListItemContent, ListItemDecorator } from '@mui/joy';
import { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../../../types/order';
import { useOrderStore } from '../../../store/orderStore';
import { OrderItemsModal } from './order-items-modal';

interface OrderListProps {
  status: OrderStatus;
}

const getNextStatus = (currentStatus: OrderStatus): OrderStatus => {
  switch (currentStatus) {
    case 'Created':
      return 'Worked';
    case 'Worked':
      return 'Ready';
    case 'Ready':
      return 'Issued';
    default:
      return currentStatus;
  }
};

const getStatusButtonText = (status: OrderStatus): string => {
  switch (status) {
    case 'Created':
      return 'Взять в работу';
    case 'Worked':
      return 'Отметить как готовый';
    case 'Ready':
      return 'Отметить как выданный';
    default:
      return 'Изменить статус';
  }
};

export const OrderList = ({ status }: OrderListProps) => {
  const { ordersByStatus, fetchOrdersByStatus, updateOrderStatus } = useOrderStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orders = ordersByStatus[status] || [];

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchOrdersByStatus(status);
      } catch (err) {
        setError('Не удалось загрузить заказы');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [status, fetchOrdersByStatus]);

  const handleOrderStatusChange = async (order: Order) => {
    try {
      setLoading(true);
      setError(null);
      const nextStatus = getNextStatus(status);
      
      if (status === 'Created') {
        // Если статус "Created", сначала обновляем статус на "Worked"
        await updateOrderStatus(order.id, 'Worked');
        // Затем открываем модальное окно
        setSelectedOrder(order);
        setIsModalOpen(true);
      } else {
        // Для других статусов просто обновляем статус
        await updateOrderStatus(order.id, nextStatus);
      }
    } catch (err) {
      setError('Не удалось обновить статус заказа');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAssembly = async () => {
    if (!selectedOrder) return;
    
    try {
      setLoading(true);
      setError(null);
      await updateOrderStatus(selectedOrder.id, 'Ready');
      setIsModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      setError('Не удалось завершить сборку');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Загрузка...</Typography>;
  }

  if (error) {
    return <Typography color="danger">{error}</Typography>;
  }

  if (orders.length === 0) {
    return <Typography>Нет заказов</Typography>;
  }

  return (
    <>
      <List>
        {orders.map((order) => (
          <ListItem key={order.id}>
            <ListItemDecorator>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.500' }} />
            </ListItemDecorator>
            <ListItemContent>
              <Typography level="body-md">
                Заказ #{order.id}
              </Typography>
              <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                {order.products.map(item => `${item.product.name} (${item.quantity} шт.)`).join(', ')}
              </Typography>
              <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                Сумма: {order.total_amount} ₽
              </Typography>
            </ListItemContent>
            <Button
              size="sm"
              variant="outlined"
              onClick={() => handleOrderStatusChange(order)}
              disabled={status === 'Issued' || loading}
            >
              {getStatusButtonText(status)}
            </Button>
          </ListItem>
        ))}
      </List>

      <OrderItemsModal
        order={selectedOrder}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        onComplete={handleCompleteAssembly}
      />
    </>
  );
}; 