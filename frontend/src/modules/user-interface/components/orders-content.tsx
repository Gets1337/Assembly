import { useEffect, useState } from 'react';
import { Box, Typography, Sheet, CircularProgress, Modal, ModalDialog, ModalClose, Divider, AspectRatio } from '@mui/joy';
import { Order, ORDER_STATUS } from '../types';
import { orderService } from '../services/order-service';
import { translateStatus } from '../utils/status-translator';

const STATUS_COLORS = {
  [ORDER_STATUS.CREATED]: 'warning.500',
  [ORDER_STATUS.WORKED]: 'warning.500',
  [ORDER_STATUS.READY]: 'success.500',
  [ORDER_STATUS.ISSUED]: 'success.500',
} as const;

export const OrdersContent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (error) {
        setError('Ошибка при загрузке заказов');
        console.error('Ошибка при загрузке заказов:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const getStatusColor = (statusName: string) => {
    return STATUS_COLORS[statusName as keyof typeof STATUS_COLORS] || 'neutral.500';
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="danger" level="h4" sx={{ textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Typography level="h4" sx={{ mb: 3 }}>
        Мои заказы
      </Typography>

      {orders.length === 0 ? (
        <Typography>У вас пока нет заказов</Typography>
      ) : (
        orders.map((order) => (
          <Sheet
            key={order.id}
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 'md',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'background.level1'
              }
            }}
            onClick={() => handleOrderClick(order)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography level="title-md">
                Заказ #{order.id}
              </Typography>
              <Typography
                level="body-sm"
                sx={{
                  color: getStatusColor(translateStatus(order.status.name))
                }}
              >
                {translateStatus(order.status.name)}
              </Typography>
            </Box>

            <Typography level="body-sm" sx={{ color: 'neutral.500', mb: 1 }}>
              {new Date(order.created_at).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>

            <Typography level="body-sm" sx={{ mb: 1 }}>
              Способ оплаты: {order.payment_method === 'card' ? 'Банковской картой' : 'Наличными при получении'}
            </Typography>

            <Typography level="title-md">
              Сумма: {order.total_amount} ₽
            </Typography>
          </Sheet>
        ))
      )}

      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <ModalDialog
          variant="outlined"
          role="dialog"
          aria-labelledby="order-details-dialog"
          sx={{
            maxWidth: 500,
            width: '100%',
            p: 3,
            borderRadius: 'md',
          }}
        >
          <ModalClose />
          <Typography level="h4" sx={{ mb: 2 }}>
            Детали заказа #{selectedOrder?.id}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography level="body-sm" sx={{ color: 'neutral.500' }}>
              {new Date(selectedOrder?.created_at || '').toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
            <Typography
              level="body-sm"
              sx={{
                color: getStatusColor(translateStatus(selectedOrder?.status.name || ''))
              }}
            >
              Статус: {translateStatus(selectedOrder?.status.name || '')}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography level="title-md" sx={{ mb: 2 }}>
            Товары в заказе:
          </Typography>

          {selectedOrder?.products?.map((item) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <AspectRatio
                  ratio="1"
                  sx={{
                    width: 80,
                    borderRadius: 'sm',
                    overflow: 'hidden',
                    bgcolor: 'background.level1'
                  }}
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                  />
                </AspectRatio>
                <Box sx={{ flex: 1 }}>
                  <Typography level="body-md">
                    {item.product.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography level="body-sm" sx={{ color: 'neutral.500' }}>
                      {item.quantity} шт.
                    </Typography>
                    <Typography level="body-sm">
                      {item.product.price * item.quantity} ₽
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography level="title-md">
              Итого:
            </Typography>
            <Typography level="title-lg">
              {selectedOrder?.total_amount} ₽
            </Typography>
          </Box>

          <Typography level="body-sm" sx={{ mt: 2, color: 'neutral.500' }}>
            Способ оплаты: {selectedOrder?.payment_method === 'card' ? 'Банковской картой' : 'Наличными при получении'}
          </Typography>
        </ModalDialog>
      </Modal>
    </Box>
  );
}; 