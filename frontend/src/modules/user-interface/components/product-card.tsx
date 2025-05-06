import { Card, Typography, AspectRatio, Button, Modal, ModalDialog, ModalClose, Box } from '@mui/joy';
import { useState } from 'react';
import { ProductCardProps } from '../types';
export const ProductCard = ({ id, title, description, price, image, onAddToCart }: ProductCardProps) => {
  const [open, setOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{ 
          width: 400,
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
        onClick={() => setOpen(true)}
      >
        <AspectRatio minHeight="250px" maxHeight="250px">
          <img 
            src={image} 
            alt={title} 
            style={{ 
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }} 
          />
        </AspectRatio>
        <Box sx={{ p: 2 }}>
          <Typography level="title-lg" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography level="body-lg" sx={{ color: 'primary.500', fontWeight: 'bold', mb: 2 }}>
            {price} ₽
          </Typography>
          <Button
            variant="solid"
            color={isAdded ? "success" : "primary"}
            fullWidth
            onClick={handleAddToCart}
          >
            {isAdded ? "Товар добавлен в корзину" : "Добавить в корзину"}
          </Button>
        </Box>
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
            {title}
          </Typography>
          <AspectRatio minHeight="300px" maxHeight="300px" sx={{ my: 2 }}>
            <img src={image} alt={title} />
          </AspectRatio>
          <Typography level="body-md" sx={{ mb: 2 }}>
            {description}
          </Typography>
          <Typography level="title-lg" sx={{ mb: 2 }}>
            {price} ₽
          </Typography>
        </ModalDialog>
      </Modal>
    </>
  );
}; 