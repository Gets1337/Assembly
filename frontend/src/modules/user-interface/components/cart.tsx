import { Sheet, Typography, Button, IconButton, Box } from '@mui/joy';
import DeleteIcon from '@mui/icons-material/Delete';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export const Cart = ({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 'sm',
        minWidth: 300,
      }}
    >
      <Typography level="title-lg" sx={{ mb: 2 }}>
        Корзина
      </Typography>
      
      {items.length === 0 ? (
        <Typography level="body-md">Корзина пуста</Typography>
      ) : (
        <>
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                p: 1,
                borderRadius: 'sm',
                '&:hover': {
                  bgcolor: 'background.level1',
                },
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: 50, height: 50, objectFit: 'cover' }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography level="body-md">{item.title}</Typography>
                <Typography level="body-sm">{item.price} ₽</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <Typography level="body-md">{item.quantity}</Typography>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
                <IconButton
                  variant="plain"
                  color="danger"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
          
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography level="title-lg" sx={{ mb: 2 }}>
              Итого: {total} ₽
            </Typography>
            <Button
              variant="solid"
              color="primary"
              fullWidth
              onClick={onCheckout}
            >
              Оформить заказ
            </Button>
          </Box>
        </>
      )}
    </Sheet>
  );
}; 