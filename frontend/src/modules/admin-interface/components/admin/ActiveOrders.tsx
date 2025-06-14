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

const ActiveOrders: React.FC = () => {
  const { activeOrders, isLoading, error, fetchActiveOrders } = useAdminStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchActiveOrders();
  }, [fetchActiveOrders]);

  if (isLoading.activeOrders) {
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

  if (error.activeOrders) {
    return (
      <Box sx={{ 
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <Typography color="danger">{error.activeOrders}</Typography>
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

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
      borderRadius: '16px',
      p: { xs: 1, sm: 2, md: 3 }
    }}>
      <Sheet 
        variant="outlined" 
        sx={{ 
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          background: '#ffffff'
        }}
      >
        {isMobile ? (
          <Box sx={{ p: 2 }}>
            {activeOrders && activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <Sheet
                  key={order.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
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
                    {order.products.map((item, index) => (
                      <Typography key={index} level="body-sm">
                        {item.product.name} x {item.quantity}
                      </Typography>
                    ))}
                  </Box>
                </Sheet>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography>Нет активных заказов</Typography>
              </Box>
            )}
          </Box>
        ) : (
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
              {activeOrders && activeOrders.length > 0 ? (
                activeOrders.map((order) => (
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
                      {order.products.map((item, index) => (
                        <div key={index}>
                          {item.product.name} x {item.quantity}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    <Typography>Нет активных заказов</Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Sheet>
    </Box>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Created':
      return 'primary';
    case 'Worked':
      return 'warning';
    case 'Ready':
      return 'success';
    default:
      return 'neutral';
  }
};

export default ActiveOrders; 