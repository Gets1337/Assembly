import { useEffect, useState } from 'react';
import { Sheet, Typography, Button, IconButton, Box, CircularProgress } from '@mui/joy';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStore } from '../store/product-store';
import { CartProps } from '../types';
import { OrderModal } from './order-modal';
import { orderService } from '../services/order-service';
import { useNavigate } from 'react-router-dom';

export const Cart = ({}: CartProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { cart = [], fetchCart, updateQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchCart();
      } catch (error) {
        setError('Ошибка при загрузке корзины');
        console.error('Ошибка при загрузке корзины:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    setError(null);
    try {
      const item = cart.find(item => item.id === itemId);
      if (!item) return;

      if (newQuantity > item.product.stock_quantity) {
        setError('Превышено максимальное количество товара');
        return;
      }

      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      setError('Ошибка при обновлении количества товара');
      console.error('Ошибка при обновлении количества:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setError(null);
    try {
      await removeFromCart(itemId);
    } catch (error) {
      setError('Ошибка при удалении товара из корзины');
      console.error('Ошибка при удалении товара:', error);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setError('Корзина пуста');
      return;
    }
    setIsOrderModalOpen(true);
  };

  const handleOrderConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await orderService.createOrder();
      await fetchCart();
      navigate('/orders');
    } catch (error) {
      setError('Ошибка при оформлении заказа');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="danger" level="h4" sx={{ textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <>
      <Sheet
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1000px',
          mx: 'auto',
          background: '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Typography 
          level="h4" 
          sx={{ 
            mb: 3,
            fontWeight: 'bold',
            color: '#1976D2',
            fontSize: '1.75rem'
          }}
        >
          Корзина
        </Typography>
        
        {error && (
          <Typography color="danger" level="body-md" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {cart.length === 0 ? (
          <Typography 
            level="body-lg" 
            sx={{ 
              textAlign: 'center',
              color: 'neutral.500',
              py: 4
            }}
          >
            Корзина пуста
          </Typography>
        ) : (
          <>
            {cart.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 2,
                  px: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  borderRadius: '8px',
                  position: 'relative',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 0 },
                  '&:hover': {
                    background: 'rgba(25, 118, 210, 0.04)',
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '100%',
                  gap: 2
                }}>
                  <Box
                    sx={{
                      width: '80px',
                      height: '80px',
                      borderRadius: 'sm',
                      overflow: 'hidden',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#F7F7F7'
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography level="title-md" sx={{ fontWeight: 'bold' }}>
                      {item.product.name}
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'neutral.500' }}>
                      {item.product.price} ₽
                    </Typography>
                  </Box>
                  
                  <Typography 
                    sx={{ 
                      minWidth: '80px', 
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#1976D2',
                      display: { xs: 'block', sm: 'none' }
                    }}
                  >
                    {item.product.price * item.quantity} ₽
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: 2
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    flexDirection: 'row'
                  }}>
                    <Button
                      variant="outlined"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      sx={{
                        transition: 'all 0.2s ease-in-out',
                        '&:hover:not(:disabled)': {
                          background: 'rgba(33, 150, 243, 0.1)',
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      -
                    </Button>
                    <Typography sx={{ minWidth: '2ch', textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock_quantity}
                      sx={{
                        transition: 'all 0.2s ease-in-out',
                        '&:hover:not(:disabled)': {
                          background: 'rgba(33, 150, 243, 0.1)',
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      +
                    </Button>
                  </Box>
                  
                  <Typography 
                    sx={{ 
                      minWidth: '100px', 
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#1976D2',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {item.product.price * item.quantity} ₽
                  </Typography>
                  
                  <IconButton
                    variant="soft"
                    color="danger"
                    onClick={() => handleRemoveItem(item.id)}
                    sx={{ 
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        background: 'rgba(211, 47, 47, 0.1)',
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography level="title-lg" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
                Итого: {total} ₽
              </Typography>
              <Button
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading || cart.length === 0}
                loading={isLoading}
                sx={{
                  background: '#1976D2',
                  boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                  '&:hover': {
                    background: '#1565C0',
                  },
                }}
              >
                Оформить заказ
              </Button>
            </Box>
          </>
        )}
      </Sheet>

      <OrderModal
        open={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onConfirm={handleOrderConfirm}
        totalAmount={total}
      />
    </>
  );
}; 