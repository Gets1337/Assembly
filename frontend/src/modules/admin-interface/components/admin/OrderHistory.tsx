import React, { useEffect } from 'react';
import {
  Table,
  Sheet,
  Typography,
  Box,
  useTheme
} from '@mui/joy';
import { useMediaQuery } from '@mui/material';
import { useAdminStore } from '../../store/adminStore';

const OrderHistory: React.FC = () => {
  const { orderHistory, isLoading, error, fetchOrderHistory } = useAdminStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

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
                          src={item.product.image_url ?? ''}
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
                              width: '60px',
                              height: '60px',
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
                                objectFit: 'cover',
                              }}
                            />
                          </Box>
                        ))}
                        {order.products && order.products.length > 4 && (
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
                              fontSize: '1.25rem',
                            }}
                          >
                            +{order.products.length - 4}
                          </Box>
                        )}
                      </Box>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    <Typography>Нет истории заказов</Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Sheet>
      )}
    </Box>
  );
};

export default OrderHistory; 