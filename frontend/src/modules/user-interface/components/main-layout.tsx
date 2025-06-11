import { useEffect, useState } from 'react';
import { Box, Tabs, TabList, Tab, TabPanel, Typography, CircularProgress } from '@mui/joy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ProductCard } from './product-card';
import { Cart } from './cart';
import { OrdersContent } from './orders-content';
import { useStore } from '../store/product-store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/auth-store';

export const MainLayout = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { products = [], fetchProducts, fetchCart} = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchProducts();
      } catch (error) {
        setError('Ошибка при загрузке товаров');
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
  }, [location.pathname]);

  const handleTabChange = (_: React.SyntheticEvent | null, value: string | number | null) => {
    if (typeof value === 'number') {
      setActiveTab(value);
      switch (value) {
        case 0:
          navigate('/store');
          break;
        case 1:
          navigate('/cart');
          fetchCart().catch(error => {
            console.error('Ошибка при загрузке корзины:', error);
          });
          break;
        case 2:
          navigate('/orders');
          break;
      }
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
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
          <Tab value={0}>
            <StoreIcon sx={{ mr: 1 }} />
            Товары
          </Tab>
          {user && (
            <Box sx={{ display: 'flex' }}>
              <Tab value={1}>
                <ShoppingCartIcon sx={{ mr: 1 }} />
                Корзина
              </Tab>
              <Tab value={2}>
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

          {user && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <TabPanel value={1} sx={{ flex: 1 }}>
                <Cart
                  onCheckout={() => {}}
                />
              </TabPanel>
              <TabPanel value={2} sx={{ flex: 1 }}>
                <OrdersContent />
              </TabPanel>
            </Box>
          )}
        </Box>
      </Tabs>
    </Box>
  );
};  