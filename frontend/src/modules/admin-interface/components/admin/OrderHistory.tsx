import React, { useEffect, useState } from 'react';
import {
  Table,
  Sheet,
  Typography,
  Box,
  useTheme,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  Stack,
  IconButton,
  Tooltip
} from '@mui/joy';
import { useMediaQuery } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useAdminStore } from '../../store/adminStore';

const OrderHistory: React.FC = () => {
  const { orderHistory, isLoading, error, fetchOrderHistory } = useAdminStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Состояние для модального окна просмотра деталей
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  if (isLoading.orderHistory) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%', 
        minHeight: '400px'
      }}>
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  if (error.orderHistory) {
    return (
      <Box sx={{ 
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <Typography color="danger">{error.orderHistory}</Typography>
      </Box>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Created':
        return 'Создан';
      case 'Worked':
        return 'В работе';
      case 'Ready':
        return 'Готов к выдаче';
      case 'Issued':
        return 'Выдан';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Created':
        return 'primary';
      case 'Worked':
        return 'warning';
      case 'Ready':
        return 'success';
      case 'Issued':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%'
    }}>
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orderHistory && orderHistory.length > 0 ? (
            orderHistory.map((order) => (
              <Sheet
                key={order.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography level="title-md">Заказ #{order.id}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="soft"
                    color={getStatusColor(order.status.name)}
                    sx={{ 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      display: 'inline-block'
                    }}
                  >
                    {getStatusText(order.status.name)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography level="body-sm" textColor="neutral.500">
                    Пользователь:
                  </Typography>
                  <Typography>{order.user.full_name}</Typography>
                  <Typography level="body-sm" textColor="neutral.500">
                    {order.user.login}
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography level="body-sm" textColor="neutral.500">
                    Дата создания:
                  </Typography>
                  <Typography>{formatDateTime(order.created_at)}</Typography>
                </Box>
                <Box>
                  <Typography level="body-sm" textColor="neutral.500" sx={{ mb: 0.5 }}>
                    Товары:
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '4px',
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
                    {order.products?.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          gap: 1,
                          alignItems: 'center',
                          p: 1,
                          borderRadius: '4px',
                          background: '#F7F7F7',
                        }}
                      >
                        <Box
                          sx={{
                            flexShrink: 0,
                            width: '40px',
                            height: '40px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
                          }}
                        >
                          <img
                            src={item.product.image_url ?? ''}
                            alt={item.product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              backgroundColor: '#F7F7F7'
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography level="body-sm" sx={{ 
                            fontWeight: 'bold',
                            wordBreak: 'break-word',
                            fontSize: '0.75rem'
                          }}>
                            {item.product.name}
                          </Typography>
                          <Typography level="body-xs" sx={{ 
                            color: '#636E72',
                            fontSize: '0.7rem'
                          }}>
                            {item.quantity} шт. × {item.product.price} ₽ = {item.product.price * item.quantity} ₽
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Tooltip title="Просмотреть заказ">
                    <IconButton
                      size="sm"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Sheet>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>Нет истории заказов</Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Sheet 
          variant="outlined"
          sx={{
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Статус</th>
                <th>Пользователь</th>
                <th>Дата и время создания</th>
                <th>Товары</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory && orderHistory.length > 0 ? (
                orderHistory.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <Typography
                        variant="soft"
                        color={getStatusColor(order.status.name)}
                        sx={{ 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          display: 'inline-block'
                        }}
                      >
                        {getStatusText(order.status.name)}
                      </Typography>
                    </td>
                    <td>
                      {order.user.full_name}
                      <br />
                      <Typography level="body-sm" textColor="neutral.500">
                        {order.user.login}
                      </Typography>
                    </td>
                    <td>
                      {formatDateTime(order.created_at)}
                    </td>
                    <td>
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        maxHeight: '150px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '4px',
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
                        {order.products?.map((item: any) => (
                          <Box
                            key={item.id}
                            sx={{
                              display: 'flex',
                              gap: 1,
                              alignItems: 'center',
                              p: 1,
                              borderRadius: '4px',
                              background: '#F7F7F7',
                              fontSize: '0.75rem',
                            }}
                          >
                            <Box
                              sx={{
                                flexShrink: 0,
                                width: '30px',
                                height: '30px',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
                              }}
                            >
                              <img
                                src={item.product.image_url ?? ''}
                                alt={item.product.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  backgroundColor: '#F7F7F7'
                                }}
                              />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography level="body-xs" sx={{ 
                                fontWeight: 'bold',
                                wordBreak: 'break-word',
                                fontSize: '0.7rem'
                              }}>
                                {item.product.name}
                              </Typography>
                              <Typography level="body-xs" sx={{ 
                                color: '#636E72',
                                fontSize: '0.65rem'
                              }}>
                                {item.quantity} шт. × {item.product.price} ₽
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </td>
                    <td>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Tooltip title="Просмотреть заказ">
                          <IconButton
                            size="sm"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>
                    <Typography>Нет истории заказов</Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Sheet>
      )}

      {/* Модальное окно просмотра деталей заказа */}
      <Modal open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)}>
        <ModalDialog size="md">
          <ModalClose />
          <DialogTitle>Детали заказа #{selectedOrder?.id}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <FormControl>
                <FormLabel>Статус</FormLabel>
                <Typography>{getStatusText(selectedOrder?.status.name || '')}</Typography>
              </FormControl>
              
              <FormControl>
                <FormLabel>Пользователь</FormLabel>
                <Typography>{selectedOrder?.user.full_name}</Typography>
              </FormControl>
              
              <FormControl>
                <FormLabel>Дата создания</FormLabel>
                <Typography>{formatDateTime(selectedOrder?.created_at || '')}</Typography>
              </FormControl>
             
              <FormControl>
                <FormLabel>Товары</FormLabel>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  maxHeight: '400px',
                  overflowY: 'auto',
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
                  {selectedOrder?.products?.map((item: any) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: 'divider',
                        background: '#F7F7F7',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          background: '#EFEFEF',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      <Box
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
                          src={item.product.image_url ?? ''}
                          alt={item.product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            backgroundColor: '#F7F7F7'
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography level="title-md" sx={{ 
                          fontWeight: 'bold',
                          color: '#2D3436',
                          mb: 1,
                          wordBreak: 'break-word'
                        }}>
                          {item.product.name}
                        </Typography>
                        {item.product.description && (
                          <Typography level="body-sm" sx={{ 
                            color: '#636E72',
                            mb: 1,
                            wordBreak: 'break-word'
                          }}>
                            {item.product.description}
                          </Typography>
                        )}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 1
                        }}>
                          <Typography level="body-sm" sx={{ color: '#636E72' }}>
                            Количество: {item.quantity} шт.
                          </Typography>
                          <Typography level="body-sm" sx={{ color: '#636E72' }}>
                            Цена: {item.product.price} ₽
                          </Typography>
                          <Typography level="title-md" sx={{ 
                            fontWeight: 'bold',
                            color: '#1976D2'
                          }}>
                            {item.product.price * item.quantity} ₽
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Общая сумма заказа</FormLabel>
                <Typography level="h4" sx={{ 
                  fontWeight: 'bold',
                  color: '#1976D2'
                }}>
                  {selectedOrder?.total_amount} ₽
                </Typography>
              </FormControl>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default OrderHistory; 