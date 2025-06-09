import { Drawer, Typography, IconButton, Box, Button } from '@mui/joy';
import { Close } from '@mui/icons-material';
import { CartDrawerProps } from '../types';

export const CartDrawer = ({ open, onClose, items, onUpdateQuantity, onRemoveItem }: CartDrawerProps) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return;

    // Проверяем, не превышает ли новое количество доступное количество на складе
    if (newQuantity > item.product.stock_quantity) {
      return;
    }

    onUpdateQuantity(itemId, newQuantity);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      size="sm"
      sx={{
        '--Drawer-padding': '1rem',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography level="h4">Корзина</Typography>
        <IconButton variant="plain" color="neutral" onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              gap: 2,
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 'sm',
            }}
          >
            <img
              src={item.product.image_url}
              alt={item.product.name}
              style={{ width: 80, height: 80, objectFit: 'cover' }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-md">{item.product.name}</Typography>
              <Typography level="body-sm">{item.product.price} ₽</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <Typography sx={{ px: 2, display: 'flex', alignItems: 'center' }}>
                  {item.quantity}
                </Typography>
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock_quantity}
                >
                  +
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="plain"
                  onClick={() => onRemoveItem(item.id)}
                >
                  Удалить
                </Button>
              </Box>
            </Box>
          </Box>
        ))}

        {items.length === 0 && (
          <Typography level="body-lg" sx={{ textAlign: 'center', py: 4 }}>
            Корзина пуста
          </Typography>
        )}

        {items.length > 0 && (
          <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography level="title-lg" sx={{ mb: 2 }}>
              Итого: {total} ₽
            </Typography>
            <Button fullWidth>Оформить заказ</Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}; 