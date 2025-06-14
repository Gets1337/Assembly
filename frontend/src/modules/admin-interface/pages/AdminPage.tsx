import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Sheet,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  IconButton,
  useTheme
} from '@mui/joy';
import { useMediaQuery } from '@mui/material';
import ActiveOrders from '../components/admin/ActiveOrders';
import UserManagement from '../components/admin/UserManagement';
import OrderHistory from '../components/admin/OrderHistory';
import ProductManagement from '../components/admin/ProductManagement';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/auth-store';
import InterfaceSwitcher from '../components/InterfaceSwitcher';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'history' | 'products'>('orders');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const menuItems = [
    { id: 'orders', label: 'Активные заказы', icon: <ShoppingCartIcon /> },
    { id: 'users', label: 'Пользователи', icon: <PeopleIcon /> },
    { id: 'history', label: 'История заказов', icon: <HistoryIcon /> },
    { id: 'products', label: 'Товары', icon: <InventoryIcon /> }
  ];

  const drawer = (
    <Drawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        '--Drawer-padding': '1rem',
        '--Drawer-width': '280px',
        bgcolor: 'white'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography level="h4">Меню</Typography>
        <IconButton 
          variant="plain" 
          color="neutral" 
          onClick={() => setDrawerOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List size="sm" sx={{ '--ListItem-radius': '8px', '--List-gap': '4px' }}>
        {menuItems.map((item) => (
          <ListItem key={item.id}>
            <ListItemButton
              selected={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                if (isMobile) setDrawerOpen(false);
              }}
            >
              <ListItemDecorator>{item.icon}</ListItemDecorator>
              <ListItemContent>{item.label}</ListItemContent>
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem>
          <ListItemButton
            color="danger"
            onClick={handleLogout}
          >
            <ListItemDecorator>
              <LogoutIcon />
            </ListItemDecorator>
            <ListItemContent>Выйти</ListItemContent>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)'
      }}
    >
      <Sheet
        variant="solid"
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(90deg, #1a237e 0%, #283593 100%)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              variant="plain"
              color="neutral"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            level="h4" 
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Панель администратора
          </Typography>
          {!isMobile && (
            <Typography 
            level="h4" 
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
              / {getTabTitle()}
            </Typography>
          )}
        </Box>
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'solid' : 'outlined'}
                onClick={() => setActiveTab(item.id as any)}
                startDecorator={item.icon}
                sx={{ 
                  color: activeTab === item.id ? 'white' : 'inherit',
                  '&:hover': {
                    backgroundColor: activeTab === item.id ? 'primary.600' : 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="outlined"
              color="danger"
              onClick={handleLogout}
              startDecorator={<LogoutIcon />}
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
        )}
      </Sheet>

      <InterfaceSwitcher />

      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: { xs: 1, sm: 2, md: 3 },
      }}>
        <Sheet 
          variant="outlined" 
          sx={{ 
            p: { xs: 1, sm: 2, md: 3 },
            borderRadius: '12px',
            bgcolor: 'background.surface',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          {activeTab === 'orders' && <ActiveOrders />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'history' && <OrderHistory />}
          {activeTab === 'products' && <ProductManagement />}
        </Sheet>
      </Box>

      {drawer}
    </Container>
  );
};

export { AdminPage };