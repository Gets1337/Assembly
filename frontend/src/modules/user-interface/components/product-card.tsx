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
          border: 'none',
          borderRadius: '12px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-4px)',
            '& .product-image': {
              transform: 'scale(1.05)',
            },
            '& .product-button': {
              background: '#FF6B6B',
            }
          },
        }}
        onClick={() => setOpen(true)}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
          <AspectRatio ratio="1" sx={{ minWidth: 200 }}>
            <img
              className="product-image"
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              style={{ 
                objectFit: 'contain',
                width: '100%',
                height: '100%',
                backgroundColor: '#F7F7F7',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </AspectRatio>
          {isInCart && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: '#4CAF50',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
              }}
            >
              В корзине
            </Box>
          )}
          {isOutOfStock && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: '#FF6B6B',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
              }}
            >
              Нет в наличии
            </Box>
          )}
        </Box>
        <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography level="title-md" sx={{ 
            fontWeight: 'bold', 
            color: '#2D3436',
            fontSize: '1.1rem',
            lineHeight: 1.4
          }}>
            {product.name}
          </Typography>
          <Typography level="body-md" sx={{ 
            color: '#636E72',
            flex: 1,
            fontSize: '0.95rem',
            lineHeight: 1.5
          }}>
            {product.description}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 1,
            pt: 2,
            borderTop: '1px solid',
            borderColor: '#DFE6E9'
          }}>
            <Box>
              <Typography level="h4" sx={{ 
                fontWeight: 'bold',
                color: '#FF6B6B',
                fontSize: '1.25rem'
              }}>
                {product.price} ₽
              </Typography>
            </Box>
            <Button
              className="product-button"
              size="md"
              variant="solid"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isInCart || isLoading}
              loading={isLoading}
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'primary',
                borderRadius: '8px',
                px: 2,
                '&:hover': {
                  background: 'primary',
                  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                },
                '&:disabled': {
                  background: 'primary',
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
            maxWidth: 600,
            width: '100%',
            overflow: 'auto',
            borderRadius: '16px',
            background: '#ffffff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }}
        >
          <ModalClose sx={{ position: 'absolute', right: 16, top: 16 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <AspectRatio 
              ratio="4/3" 
              sx={{ 
                minWidth: 200,
                maxWidth: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
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
                  backgroundColor: '#F7F7F7'
                }}
              />
            </AspectRatio>
            <Box sx={{ px: 1 }}>
              <Typography level="h3" sx={{ 
                mb: 1, 
                fontWeight: 'bold',
                color: '#2D3436',
                fontSize: '1.5rem'
              }}>
                {product.name}
              </Typography>
              <Typography level="body-lg" sx={{ 
                color: '#636E72',
                mb: 3,
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}>
                {product.description}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pt: 2,
                borderTop: '1px solid',
                borderColor: '#DFE6E9'
              }}>
                <Typography level="h2" sx={{ 
                  fontWeight: 'bold',
                  color: 'primary',
                  fontSize: '2rem'
                }}>
                  {product.price} ₽
                </Typography>
                <Button
                  size="lg"
                  variant="solid"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isInCart || isLoading}
                  loading={isLoading}
                  sx={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: '#FF6B6B',
                    borderRadius: '8px',
                    px: 3,
                    '&:hover': {
                      background: '#FF5252',
                      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                    },
                    '&:disabled': {
                      background: '#B2BEC3',
                    }
                  }}
                >
                  {isInCart ? 'В корзине' : isOutOfStock ? 'Нет в наличии' : 'В корзину'}
                </Button>
              </Box>
            </Box>
            {error && (
              <Typography color="danger" level="body-sm" sx={{ textAlign: 'center' }}>
                {error}
              </Typography>
            )}
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
}; 