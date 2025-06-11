import React, { useState } from 'react';
import { Box, Button, Container, Typography, Sheet } from '@mui/joy';
import ActiveOrders from '../components/admin/ActiveOrders';
import UserManagement from '../components/admin/UserManagement';
import OrderHistory from '../components/admin/OrderHistory';
import ProductManagement from '../components/admin/ProductManagement';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/auth-store';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'history' | 'products'>('orders');
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'orders':
        return 'Активные заказы';
      case 'users':
        return 'Управление пользователями';
      case 'history':
        return 'История заказов';
      case 'products':
        return 'Управление товарами';
      default:
        return 'Панель администратора';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Sheet
        variant="solid"
        color="primary"
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography level="h4" sx={{ color: 'white' }}>
            Панель администратора
          </Typography>
          <Typography level="h4" sx={{ color: 'white', opacity: 0.8 }}>
            / {getTabTitle()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={activeTab === 'orders' ? 'solid' : 'outlined'}
            onClick={() => setActiveTab('orders')}
            sx={{ color: activeTab === 'orders' ? 'white' : 'inherit' }}
          >
            Активные заказы
          </Button>
          <Button
            variant={activeTab === 'users' ? 'solid' : 'outlined'}
            onClick={() => setActiveTab('users')}
            sx={{ color: activeTab === 'users' ? 'white' : 'inherit' }}
          >
            Пользователи
          </Button>
          <Button
            variant={activeTab === 'history' ? 'solid' : 'outlined'}
            onClick={() => setActiveTab('history')}
            sx={{ color: activeTab === 'history' ? 'white' : 'inherit' }}
          >
            История заказов
          </Button>
          <Button
            variant={activeTab === 'products' ? 'solid' : 'outlined'}
            onClick={() => setActiveTab('products')}
            sx={{ color: activeTab === 'products' ? 'white' : 'inherit' }}
          >
            Товары
          </Button>
          <Button
            variant="outlined"
            color="danger"
            onClick={handleLogout}
            sx={{ 
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Выйти
          </Button>
        </Box>
      </Sheet>

      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        bgcolor: 'background.level1'
      }}>
        <Sheet 
          variant="outlined" 
          sx={{ 
            p: 2,
            borderRadius: 'sm',
            bgcolor: 'background.surface'
          }}
        >
          {activeTab === 'orders' && <ActiveOrders />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'history' && <OrderHistory />}
          {activeTab === 'products' && <ProductManagement />}
        </Sheet>
      </Box>
    </Container>
  );
};

export { AdminPage };