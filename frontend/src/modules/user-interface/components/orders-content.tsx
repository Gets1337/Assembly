import { useEffect, useState } from 'react';
import { Box, Typography, Sheet, CircularProgress, Modal, ModalDialog, ModalClose, Divider } from '@mui/joy';
import { Order } from '../types';
import { orderService } from '../services/order-service';

const STATUS_COLORS: Record<string, string> = {
  'Создан': '#FFA726',
  'В работе': '#FFA726',
  'Готов к выдаче': '#66BB6A',
  'Выдан': '#66BB6A',
};

const STATUS_TRANSLATIONS: Record<string, string> = {
  'created': 'Создан',
  'worked': 'В работе',
  'ready': 'Готов к выдаче',
  'issued': 'Выдан',
};

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

  const getStatusColor = (status: { name: string }) => {
    const translatedStatus = STATUS_TRANSLATIONS[status.name.toLowerCase()] || status.name;
    return STATUS_COLORS[translatedStatus] || '#B0BEC5';
  };

  const getStatusText = (status: { name: string }) => {
    return STATUS_TRANSLATIONS[status.name.toLowerCase()] || status.name;
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
    <Box sx={{ 
      width: '100%',
      maxWidth: '1400px',
      mx: 'auto',
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      <Sheet
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: '16px',
          background: '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography 
          level="h3" 
          sx={{ 
            mb: 3,
            fontWeight: 'bold',
            color: '#2D3436',
            fontSize: '1.75rem'
          }}
        >
          Мои заказы
        </Typography>

        {orders.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6,
            color: '#636E72'
          }}>
            <Typography level="h4" sx={{ mb: 2 }}>
              У вас пока нет заказов
            </Typography>
            <Typography level="body-lg">
              После оформления заказа он появится в этом списке
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'grid',
            gap: 2
          }}>
            {orders.map((order) => (
              <Sheet
                key={order.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    borderColor: '#FF6B6B',
                  }
                }}
                onClick={() => handleOrderClick(order)}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Box>
                    <Typography level="title-lg" sx={{ fontWeight: 'bold', color: '#2D3436' }}>
                      Заказ #{order.id}
                    </Typography>
                    <Typography level="body-sm" sx={{ color: '#636E72', mt: 0.5 }}>
                      {new Date(order.created_at).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Typography 
                      level="title-lg" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#1976D2'
                      }}
                    >
                      {order.total_amount} ₽
                    </Typography>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        background: getStatusColor(order.status),
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {getStatusText(order.status)}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex',
                  gap: 2,
                  overflowX: 'auto',
                  pb: 1,
                  '&::-webkit-scrollbar': {
                    height: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#F7F7F7',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#DFE6E9',
                    borderRadius: '4px',
                    '&:hover': {
                      background: '#B2BEC3',
                    },
                  },
                }}>
                  {order.products?.slice(0, 4).map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        flexShrink: 0,
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  ))}
                  {order.products && order.products.length > 4 && (
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        background: '#F7F7F7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#636E72',
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                      }}
                    >
                      +{order.products.length - 4}
                    </Box>
                  )}
                </Box>
              </Sheet>
            ))}
          </Box>
        )}
      </Sheet>

      <Modal open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)}>
        <ModalDialog
          sx={{
            maxWidth: 600,
            width: '100%',
            borderRadius: '16px',
            background: '#ffffff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }}
        >
          <ModalClose sx={{ position: 'absolute', right: 16, top: 16 }} />
          {selectedOrder && (
            <Box sx={{ p: 2 }}>
              <Typography level="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#2D3436' }}>
                Заказ #{selectedOrder.id}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography level="body-sm" sx={{ color: '#636E72', mb: 0.5 }}>
                  Дата заказа
                </Typography>
                <Typography level="body-lg">
                  {new Date(selectedOrder.created_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography level="body-sm" sx={{ color: '#636E72', mb: 0.5 }}>
                  Статус заказа
                </Typography>
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 2,
                    py: 0.5,
                    borderRadius: '20px',
                    background: getStatusColor(selectedOrder.status),
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  {getStatusText(selectedOrder.status)}
                </Box>
              </Box>

              <Typography level="title-lg" sx={{ mb: 2, color: '#2D3436' }}>
                Товары в заказе
              </Typography>

              {selectedOrder.products?.map((item) => (
                <Box 
                  key={item.id} 
                  sx={{ 
                    mb: 2,
                    p: 2,
                    borderRadius: '12px',
                    background: '#F7F7F7',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography level="title-md" sx={{ fontWeight: 'bold', color: '#2D3436' }}>
                        {item.product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography level="body-sm" sx={{ color: '#636E72' }}>
                          {item.quantity} шт.
                        </Typography>
                        <Typography level="title-md" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
                          {item.product.price * item.quantity} ₽
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Typography level="title-lg" sx={{ color: '#2D3436' }}>
                  Итого:
                </Typography>
                <Typography level="h3" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
                  {selectedOrder.total_amount} ₽
                </Typography>
              </Box>

              <Typography level="body-sm" sx={{ color: '#636E72' }}>
                Способ оплаты: {selectedOrder.payment_method === 'card' ? 'Банковской картой' : 'Наличными при получении'}
              </Typography>
            </Box>
          )}
        </ModalDialog>
      </Modal>
    </Box>
  );
}; 