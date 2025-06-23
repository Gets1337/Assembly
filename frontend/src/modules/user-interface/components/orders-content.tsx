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
          width: '100%',
          overflow: 'hidden',
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
            gap: 2,
            width: '100%',
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
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
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
                  mb: 2,
                  width: '100%',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 1, sm: 0 },
                }}>
                  <Box sx={{ 
                    flex: { xs: '1 1 100%', sm: '1 1 auto' },
                    minWidth: 0,
                  }}>
                    <Typography level="title-lg" sx={{ 
                      fontWeight: 'bold', 
                      color: '#2D3436',
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                      wordBreak: 'break-word',
                    }}>
                      Заказ #{order.id}
                    </Typography>
                    <Typography level="body-sm" sx={{ 
                      color: '#636E72', 
                      mt: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}>
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
                    gap: 2,
                    flex: { xs: '1 1 100%', sm: '0 0 auto' },
                    justifyContent: { xs: 'space-between', sm: 'flex-end' },
                    mt: { xs: 1, sm: 0 },
                  }}>
                    <Typography 
                      level="title-lg" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#1976D2',
                        fontSize: { xs: '1rem', sm: '1.125rem' },
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
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
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
                  overflowY: 'hidden',
                  pb: 1,
                  width: '100%',
                  maxWidth: '100%',
                  scrollSnapType: 'x mandatory',
                  '&::-webkit-scrollbar': {
                    height: '6px',
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
                  {order.products?.slice(0, 3).map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        flexShrink: 0,
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        scrollSnapAlign: 'start',
                      }}
                    >
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          backgroundColor: '#F7F7F7'
                        }}
                      />
                    </Box>
                  ))}
                  {order.products && order.products.length > 3 && (
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        background: '#F7F7F7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#636E72',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        scrollSnapAlign: 'start',
                      }}
                    >
                      +{order.products.length - 3}
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
            maxHeight: '90vh',
            borderRadius: '16px',
            background: '#ffffff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ModalClose sx={{ position: 'absolute', right: 16, top: 16, zIndex: 1 }} />
          {selectedOrder && (
            <Box sx={{ 
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <Box sx={{ flexShrink: 0 }}>
                <Typography level="h4" sx={{ 
                  mb: 3, 
                  fontWeight: 'bold', 
                  color: '#2D3436',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}>
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

                <Typography level="title-lg" sx={{ 
                  mb: 2, 
                  color: '#2D3436',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                }}>
                  Товары в заказе
                </Typography>
              </Box>

              <Box sx={{ 
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                pr: 1,
                '&::-webkit-scrollbar': {
                  width: '6px',
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
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2,
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                    }}>
                      <Box
                        sx={{
                          width: { xs: '80px', sm: '100px' },
                          height: { xs: '80px', sm: '100px' },
                          borderRadius: '8px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            backgroundColor: '#F7F7F7'
                          }}
                        />
                      </Box>
                      <Box sx={{ 
                        flex: 1,
                        minWidth: 0,
                      }}>
                        <Typography level="title-md" sx={{ 
                          fontWeight: 'bold', 
                          color: '#2D3436',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          wordBreak: 'break-word',
                        }}>
                          {item.product.name}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          mt: 1,
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 0.5, sm: 0 },
                        }}>
                          <Typography level="body-sm" sx={{ 
                            color: '#636E72',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          }}>
                            {item.quantity} шт.
                          </Typography>
                          <Typography level="title-md" sx={{ 
                            color: '#1976D2', 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                          }}>
                            {item.product.price * item.quantity} ₽
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ flexShrink: 0, mt: 2 }}>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 0 },
                }}>
                  <Typography level="title-lg" sx={{ 
                    color: '#2D3436',
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                  }}>
                    Итого:
                  </Typography>
                  <Typography level="h3" sx={{ 
                    color: '#1976D2', 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                  }}>
                    {selectedOrder.total_amount} ₽
                  </Typography>
                </Box>

                <Typography level="body-sm" sx={{ 
                  color: '#636E72',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  textAlign: { xs: 'center', sm: 'left' },
                }}>
                  Способ оплаты: {selectedOrder.payment_method === 'card' ? 'Банковской картой' : 'Наличными при получении'}
                </Typography>
              </Box>
            </Box>
          )}
        </ModalDialog>
      </Modal>
    </Box>
  );
}; 