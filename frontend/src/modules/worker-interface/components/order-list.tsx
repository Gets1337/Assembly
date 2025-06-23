import { Box, Typography, Button, List, ListItem, Modal, ModalDialog, ModalClose, AspectRatio, Sheet } from '@mui/joy';
import { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../types/order';
import { useOrderStore } from '../store/orderStore';
import { OrderItemsModal } from './order-items-modal';

interface OrderListProps {
  status: OrderStatus;
}

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

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'Created':
      return 'primary.500';
    case 'Worked':
      return 'warning.500';
    case 'Ready':
      return 'success.500';
    case 'Issued':
      return 'neutral.500';
    default:
      return 'neutral.500';
  }
};

export const OrderList = ({ status }: OrderListProps) => {
  const { ordersByStatus, fetchOrdersByStatus, updateOrderStatus } = useOrderStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const orders = ordersByStatus[status] || [];

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

  useEffect(() => {
    loadOrders();
  }, [status, fetchOrdersByStatus]);

  useEffect(() => {
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [status]);

  const handleOrderStatusChange = async (order: Order) => {
    try {
      setLoading(true);
      setError(null);
           
      if (status === 'Created') {
        await updateOrderStatus(order.id, 'Worked');
        setSelectedOrder(order);
        setIsModalOpen(true);
      }
      
      await loadOrders();
    } catch (err) {
      setError('Не удалось обновить статус заказа');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      setLoading(true);
      setError(null);
      await updateOrderStatus(selectedOrder.id, 'Issued');
      setIsDetailsModalOpen(false);
      setSelectedOrder(null);
      await loadOrders();
    } catch (err) {
      setError('Не удалось выдать заказ');
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
      
      await loadOrders();
    } catch (err) {
      setError('Не удалось завершить сборку');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssemblyModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  if (loading && orders.length === 0) {
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
      <List
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          overflowX: 'auto',
          overflowY: 'hidden',
          pb: 1,
          px: 0.5,
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'background.level2',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'primary.500',
            borderRadius: '4px',
            '&:hover': {
              background: 'primary.600',
            },
          },
        }}
      >
        {orders.map((order) => (
          <ListItem 
            key={order.id}
            sx={{
              minWidth: 320,
              flexDirection: 'column',
              alignItems: 'flex-start',
              p: 2.5,
              borderRadius: 'xl',
              bgcolor: 'background.surface',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
              flexShrink: 0,
              scrollSnapAlign: 'start',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                borderColor: 'primary.500',
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              mb: 2,
              width: '100%'
            }}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: getStatusColor(status),
                  boxShadow: `0 0 12px ${getStatusColor(status)}`
                }} 
              />
              <Typography 
                level="title-lg" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'text.primary',
                  textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Заказ #{order.id}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 1.5,
              width: '100%',
              mt: 1
            }}>
              {(status === 'Worked' || status === 'Ready') && (
                <>
                  <Button
                    size="sm"
                    variant="soft"
                    color="neutral"
                    onClick={() => handleViewDetails(order)}
                    sx={{
                      flex: 1,
                      fontWeight: 500,
                      transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        bgcolor: 'background.level2',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    Детали
                  </Button>
                  {status === 'Worked' && (
                    <Button
                      size="sm"
                      variant="solid"
                      color="primary"
                      onClick={() => handleOpenAssemblyModal(order)}
                      sx={{
                        flex: 1,
                        fontWeight: 500,
                        transition: 'box-shadow 0.3s ease-in-out',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                        }
                      }}
                    >
                      Собрать
                    </Button>
                  )}
                </>
              )}
              {status === 'Created' && (
                <Button
                  size="sm"
                  variant="solid"
                  onClick={() => handleOrderStatusChange(order)}
                  disabled={loading}
                  color="primary"
                  sx={{
                    width: '100%',
                    fontWeight: 500,
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                    }
                  }}
                >
                  {getStatusButtonText(status)}
                </Button>
              )}
            </Box>
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

      <Modal open={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
        <ModalDialog
          aria-labelledby="order-details-dialog"
          sx={{
            maxWidth: 500,
            width: '100%',
            overflow: 'auto',
            borderRadius: 'xl',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
          }}
        >
          <ModalClose />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography 
              level="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.700',
                textShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              Детали заказа #{selectedOrder?.id}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedOrder?.products.map((item) => (
                <Sheet
                  key={item.product.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 'lg',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: 'background.level1',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <AspectRatio
                    ratio="1"
                    sx={{
                      width: 70,
                      borderRadius: 'md',
                      overflow: 'hidden',
                      bgcolor: 'background.level1',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      loading="lazy"
                      style={{ 
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#F7F7F7'
                      }}
                    />
                  </AspectRatio>
                  <Box sx={{ flex: 1 }}>
                    <Typography level="title-md" sx={{ fontWeight: 'bold' }}>
                      {item.product.name}
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                      Количество: {item.quantity} шт.
                    </Typography>
                  </Box>
                  <Typography 
                    level="title-md" 
                    sx={{ 
                      color: 'primary.700',
                      fontWeight: 'bold',
                      textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    {item.product.price * item.quantity} ₽
                  </Typography>
                </Sheet>
              ))}
            </Box>
            <Sheet
              variant="soft"
              color="primary"
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 2,
                p: 2.5,
                borderRadius: 'lg',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
              }}
            >
              <Typography level="title-lg" sx={{ fontWeight: 'bold', color: 'white' }}>
                Итого:
              </Typography>
              <Typography level="title-lg" sx={{ fontWeight: 'bold', color: 'white' }}>
                {selectedOrder?.total_amount} ₽
              </Typography>
            </Sheet>
            {status === 'Ready' && (
              <Button
                color="success"
                onClick={handleIssueOrder}
                disabled={loading}
                sx={{ 
                  mt: 2,
                  fontWeight: 500,
                  transition: 'box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
                  }
                }}
              >
                Выдать заказ
              </Button>
            )}
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
}; 