import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/joy';
import { ProductCard } from './product-card';
import { Cart } from './cart';
import { OrdersContent } from './orders-content';
import { useStore } from '../store/product-store';
import { useLocation } from 'react-router-dom';
import { NavigationHeader } from './navigation-header';

export const MainLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { products = [], fetchProducts, fetchCart } = useStore();
  const location = useLocation();

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
    if (location.pathname === '/cart') {
      fetchCart().catch(error => {
        console.error('Ошибка при загрузке корзины:', error);
      });
    }
  }, [location.pathname, fetchCart]);

  return (
    <Box sx={{ 
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#F7F7F7',
      minHeight: '100vh'
    }}>
      <NavigationHeader />

      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        mx: { xs: 1, sm: 2, md: 3 },
        mb: { xs: 1, sm: 2, md: 3 }
      }}>
        {location.pathname === '/store' && (
          <>
            {isLoading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%', 
                minHeight: '400px'
              }}>
                <CircularProgress size="lg" sx={{ color: '#FF6B6B' }} />
              </Box>
            ) : error ? (
              <Typography 
                color="danger" 
                level="h4" 
                sx={{ 
                  textAlign: 'center', 
                  py: 4
                }}
              >
                {error}
              </Typography>
            ) : (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: { xs: 2, sm: 3 },
                p: { xs: 2, sm: 3, md: 4 },
                maxWidth: '1400px',
                mx: 'auto',
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
          </>
        )}

        {location.pathname === '/cart' && (
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: 'calc(100vh - 200px)',
            background: '#F7F7F7'
          }}>
            <Cart onCheckout={() => {}} />
          </Box>
        )}

        {location.pathname === '/orders' && (
          <OrdersContent />
        )}
      </Box>
    </Box>
  );
};  