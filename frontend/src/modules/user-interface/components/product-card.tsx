import { useState } from 'react';
import { Box, Card, Typography, Button, Modal, ModalDialog, ModalClose, AspectRatio, CircularProgress } from '@mui/joy';
import { useStore } from '../store/product-store';
import { ProductCardProps } from '../types';
import { useNavigate } from 'react-router-dom';

export const ProductCard = ({ product }: ProductCardProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useStore();
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await addToCart(product);
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
        onClick={() => setOpen(true)}
        sx={{
          width: '100%',
          maxWidth: '300px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 'md',
            transform: 'translateY(-4px)',
            transition: 'all 0.2s ease-in-out'
          }
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '200px',
            overflow: 'hidden',
            borderRadius: 'sm',
            bgcolor: 'background.level1'
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography level="title-lg" sx={{ mb: 1 }}>
            {product.title}
          </Typography>
          <Typography level="body-sm" sx={{ mb: 2, color: 'neutral.500' }}>
            {product.description}
          </Typography>
          <Typography level="title-md" sx={{ color: 'primary.500' }}>
            {product.price} ₽
          </Typography>
        </Box>

        {error && (
          <Typography color="danger" level="body-sm">
            {error}
          </Typography>
        )}

        <Button
          onClick={handleAddToCart}
          disabled={isLoading || isOutOfStock}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size="sm" />
          ) : isOutOfStock ? (
            'Нет в наличии'
          ) : (
            'В корзину'
          )}
        </Button>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <ModalDialog
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
          }}
        >
          <ModalClose />
          <Typography level="title-lg" sx={{ mb: 1 }}>
            {product.title}
          </Typography>
          <AspectRatio minHeight="300px" maxHeight="300px" sx={{ my: 2 }}>
            <img src={product.image} alt={product.title} />
          </AspectRatio>
          <Typography level="body-md" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          <Typography level="title-lg" sx={{ mb: 1 }}>
            {product.price} ₽
          </Typography>
          <Typography level="body-sm" sx={{ color: isOutOfStock ? 'danger.500' : 'success.500', mb: 2 }}>
            {isOutOfStock ? 'Нет в наличии' : `В наличии: ${product.stock_quantity} шт.`}
          </Typography>
        </ModalDialog>
      </Modal>
    </>
  );
}; 