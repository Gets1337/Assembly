import { useEffect, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import { Box, Tabs, TabList, Tab, TabPanel, Typography, IconButton, Stack, Menu, MenuItem, ListItemDecorator, CircularProgress } from '@mui/joy';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import { ProductCard } from './product-card';
import { Cart } from './cart';
import { OrdersPage } from '../pages/orders-page';
import { useStore } from '../store/product-store';
import { useNavigate, useLocation } from 'react-router-dom';

export const MainLayout = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { products = [], fetchProducts, fetchCart} = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchProducts();
      } catch (error) {
        setError('Ошибка при загрузке товаров');
        console.error('Ошибка при загрузке товаров:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (location.pathname === '/store') {
      setActiveTab(0);
    } else if (location.pathname === '/cart') {
      setActiveTab(1);
    } else if (location.pathname === '/orders') {
      setActiveTab(2);
    }
  }, [location]);

  const handleTabChange = (_: React.SyntheticEvent | null, value: string | number | null) => {
    if (typeof value === 'number') {
      setActiveTab(value);
      if (value === 1) {
        fetchCart().catch(error => {
          console.error('Ошибка при загрузке корзины:', error);
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <CssVarsProvider>
      <Box sx={{ 
        width: '100vw', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ 
          width: '100%',
          p: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography level="h2">Магазин</Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                variant="plain"
                color="neutral"
                onClick={handleMenuClick}
              >
                <PersonIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {isAuthenticated ? (
                  <MenuItem onClick={handleLogout}>
                    <ListItemDecorator>
                      <LogoutIcon />
                    </ListItemDecorator>
                    Выйти
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => navigate('/login')}>
                    <ListItemDecorator>
                      <PersonIcon />
                    </ListItemDecorator>
                    Войти
                  </MenuItem>
                )}
              </Menu>
            </Stack>
          </Stack>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ 
              mb: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <TabList>
              <Tab onClick={() => handleTabClick('/store')}>
                <StoreIcon sx={{ mr: 1 }} />
                Товары
              </Tab>
              {isAuthenticated && (
                <Box sx={{ display: 'flex' }}>
                  <Tab onClick={() => handleTabClick('/cart')}>
                    <ShoppingCartIcon sx={{ mr: 1 }} />
                    Корзина
                  </Tab>
                  <Tab onClick={() => handleTabClick('/orders')}>
                    <AssignmentIcon sx={{ mr: 1 }} />
                    Заказы
                  </Tab>
                </Box>
              )}
            </TabList>

            <Box sx={{ 
              mt: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <TabPanel value={0} sx={{ flex: 1 }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography color="danger">{error}</Typography>
                ) : (
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: 2,
                    flex: 1,
                    width: '100%'
                  }}>
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    ))}
                  </Box>
                )}
              </TabPanel>

              {isAuthenticated && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <TabPanel value={1} sx={{ flex: 1 }}>
                    <Cart
                      onCheckout={() => {
                        console.log('Оформление заказа');
                      }}
                    />
                  </TabPanel>
                  <TabPanel value={2} sx={{ flex: 1 }}>
                    <OrdersPage />
                  </TabPanel>
                </Box>
              )}
            </Box>
          </Tabs>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};  