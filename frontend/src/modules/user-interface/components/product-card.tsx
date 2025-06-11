import { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Modal, ModalDialog, ModalClose, AspectRatio } from '@mui/joy';
import { useStore } from '../store/product-store';
import { ProductCardProps } from '../types';
import { useNavigate } from 'react-router-dom';

export const ProductCard = ({ product }: ProductCardProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cart, fetchCart } = useStore();
  const navigate = useNavigate();

  const isInCart = cart.some(item => item.product.id === product.id);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (isInCart) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await addToCart(product);
      await fetchCart();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка при добавлении товара в корзину');
      console.error('Ошибка при добавлении в корзину:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          border: '2px solid',
          borderColor: isInCart ? 'success.500' : 'neutral.200',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 'lg',
            transform: 'translateY(-4px)',
            borderColor: isInCart ? 'success.600' : 'primary.500',
          },
        }}
        onClick={() => setOpen(true)}
      >
        <AspectRatio ratio="1" sx={{ minWidth: 200 }}>
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            style={{ objectFit: 'cover' }}
          />
        </AspectRatio>
        <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography level="title-md" sx={{ mb: 1 }}>
            {product.name}
          </Typography>
          <Typography level="body-sm" sx={{ mb: 2, flex: 1 }}>
            {product.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography level="title-lg" sx={{ color: 'primary.500' }}>
              {product.price} ₽
            </Typography>
            <Button
              size="sm"
              variant={isInCart ? "soft" : "solid"}
              color={isInCart ? "success" : "primary"}
              onClick={handleAddToCart}
              disabled={isOutOfStock || isInCart || isLoading}
              loading={isLoading}
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              {isInCart ? 'В корзине' : isOutOfStock ? 'Нет в наличии' : 'В корзину'}
            </Button>
          </Box>
        </Box>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="product-dialog"
          sx={{
            maxWidth: 500,
            width: '100%',
            overflow: 'auto',
          }}
        >
          <ModalClose />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AspectRatio 
              ratio="4/3" 
              sx={{ 
                minWidth: 200,
                maxWidth: '100%',
                borderRadius: 'md',
                overflow: 'hidden'
              }}
            >
              <img
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                style={{ 
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'background.level1'
                }}
              />
            </AspectRatio>
            <Typography level="h4">{product.name}</Typography>
            <Typography level="body-lg">{product.description}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography level="h3" sx={{ color: 'primary.500' }}>
                {product.price} ₽
              </Typography>
              <Button
                size="lg"
                variant={isInCart ? "soft" : "solid"}
                color={isInCart ? "success" : "primary"}
                onClick={handleAddToCart}
                disabled={isOutOfStock || isInCart || isLoading}
                loading={isLoading}
                sx={{
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                {isInCart ? 'В корзине' : isOutOfStock ? 'Нет в наличии' : 'В корзину'}
              </Button>
            </Box>
            {error && (
              <Typography color="danger" level="body-sm">
                {error}
              </Typography>
            )}
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
}; 