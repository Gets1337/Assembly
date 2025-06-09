import React, { useEffect } from 'react';
import {
  Table,
  Sheet,
  Typography,
  Box
} from '@mui/joy';
import { useAdminStore } from '../../store/adminStore';

const ActiveOrders: React.FC = () => {
  const { activeOrders, isLoading, error, fetchActiveOrders } = useAdminStore();

  useEffect(() => {
    fetchActiveOrders();
  }, [fetchActiveOrders]);

  if (isLoading.activeOrders) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  if (error.activeOrders) {
    return (
      <Box sx={{ p: 2 }}>
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
      height: '100%'
    }}>
      <Sheet variant="outlined">
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
                      sx={{ px: 1, py: 0.5, borderRadius: 1 }}
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