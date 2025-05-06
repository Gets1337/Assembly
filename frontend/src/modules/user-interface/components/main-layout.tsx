import { useEffect, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import { Box, Tabs, TabList, Tab, TabPanel, Typography, IconButton, Stack, Menu, MenuItem, ListItemDecorator } from '@mui/joy';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import { ProductCard } from './product-card';
import { Cart } from './cart';
import { useStore } from '../store/product-store';
import { useNavigate } from 'react-router-dom';

export const MainLayout = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { products, cart, isLoading, error, fetchProducts, addToCart, updateQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  return (
    <CssVarsProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box
          component="header"
          sx={{
            py: 2,
            px: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value as number)}
              sx={{ borderRadius: 'lg', flex: 1 }}
            >
              <TabList>
                <Tab>
                  <StoreIcon sx={{ mr: 1 }} />
                  Товары
                </Tab>
                <Tab>
                  <ShoppingCartIcon sx={{ mr: 1 }} />
                  Корзина ({cart.length})
                </Tab>
                <Tab>
                  <AssignmentIcon sx={{ mr: 1 }} />
                  Заказы
                </Tab>
                <IconButton
                  variant="outlined"
                  color="neutral"
                  onClick={handleMenuClick}
                  sx={{ ml: 2 }}
                >
                  <PersonIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  placement="bottom-end"
                >
                  <MenuItem onClick={handleLogout}>
                    <ListItemDecorator>
                      <LogoutIcon />
                    </ListItemDecorator>
                    Выйти
                  </MenuItem>
                </Menu>
              </TabList>
              <Box sx={{ flex: 1, p: 3 }}>
                <TabPanel value={0}>
                  {isLoading ? (
                    <Typography>Загрузка...</Typography>
                  ) : error ? (
                    <Typography color="danger">{error}</Typography>
                  ) : (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 4,
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '20px',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {products.map((product) => (
                        <Box key={product.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <ProductCard
                            {...product}
                            onAddToCart={() => addToCart(product)}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </TabPanel>
                <TabPanel value={1}>
                  <Cart
                    items={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                    onCheckout={() => {
                      console.log('Оформление заказа');
                    }}
                  />
                </TabPanel>
                <TabPanel value={2}>
                  <Typography level="h4" sx={{ mb: 2 }}>Мои заказы</Typography>
                </TabPanel>
              </Box>
            </Tabs>
          </Stack>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}; 