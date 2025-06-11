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
      const order = await orderService.createOrder();
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
          borderRadius: 'md',
          width: '100%',
          maxWidth: '800px',
          mx: 'auto'
        }}
      >
        <Typography level="h4" sx={{ mb: 2 }}>Корзина</Typography>
        
        {error && (
          <Typography color="danger" level="body-md" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {cart.length === 0 ? (
          <Typography>Корзина пуста</Typography>
        ) : (
          <>
            {cart.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box
                  sx={{
                    width: '80px',
                    height: '80px',
                    mr: 2,
                    borderRadius: 'sm',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography level="title-md">{item.product.name}</Typography>
                  <Typography level="body-sm" sx={{ color: 'neutral.500' }}>
                    {item.product.price} ₽
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 2 }}>
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <Typography>{item.quantity}</Typography>
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock_quantity}
                  >
                    +
                  </Button>
                </Box>
                
                <Typography sx={{ minWidth: '100px', textAlign: 'right' }}>
                  {item.product.price * item.quantity} ₽
                </Typography>
                
                <IconButton
                  variant="plain"
                  color="danger"
                  onClick={() => handleRemoveItem(item.id)}
                  sx={{ ml: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography level="title-lg">
                Итого: {total} ₽
              </Typography>
              <Button
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading || cart.length === 0}
                loading={isLoading}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
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