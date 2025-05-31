import { Box, Typography, Button, List, ListItem, ListItemContent, ListItemDecorator, Modal, ModalDialog, ModalClose, AspectRatio } from '@mui/joy';
import { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../../../types/order';
import { useOrderStore } from '../../../store/orderStore';
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
      <List>
        {orders.map((order) => (
          <ListItem 
            key={order.id}
            sx={{
              mb: 1,
              borderRadius: 'sm',
              '&:hover': {
                bgcolor: 'background.level2'
              }
            }}
          >
            <ListItemDecorator>
              <Box 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: getStatusColor(status) 
                }} 
              />
            </ListItemDecorator>
            <ListItemContent>
              <Typography level="body-md" sx={{ fontWeight: 'bold' }}>
                Заказ #{order.id}
              </Typography>
            </ListItemContent>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {(status === 'Worked' || status === 'Ready') && (
                <>
                  <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => handleViewDetails(order)}
                  >
                    Детали
                  </Button>
                  {status === 'Worked' && (
                    <Button
                      size="sm"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenAssemblyModal(order)}
                    >
                      Собрать
                    </Button>
                  )}
                </>
              )}
              {status === 'Created' && (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleOrderStatusChange(order)}
                  disabled={loading}
                  color="primary"
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
          }}
        >
          <ModalClose />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography level="h4">Детали заказа #{selectedOrder?.id}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {selectedOrder?.products.map((item) => (
                <Box
                  key={item.product.id}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 'sm',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center'
                  }}
                >
                  <AspectRatio
                    ratio="1"
                    sx={{
                      width: 60,
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
                    <Typography level="body-md" sx={{ fontWeight: 'bold' }}>
                      {item.product.name}
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                      Количество: {item.quantity} шт.
                    </Typography>
                  </Box>
                  <Typography level="body-md" sx={{ color: 'primary.500' }}>
                    {item.product.price * item.quantity} ₽
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 2,
              p: 2,
              borderRadius: 'md',
              bgcolor: 'background.level1'
            }}>
              <Typography level="h4">Итого:</Typography>
              <Typography level="h4" sx={{ color: 'primary.500' }}>
                {selectedOrder?.total_amount} ₽
              </Typography>
            </Box>
            {status === 'Ready' && (
              <Button
                color="success"
                onClick={handleIssueOrder}
                disabled={loading}
                sx={{ mt: 2 }}
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