import { Modal, ModalDialog, ModalClose, Typography, List, ListItem, ListItemContent, Button } from '@mui/joy';
import { Order } from '../../../types/order';

interface OrderItemsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OrderItemsModal = ({ order, open, onClose, onComplete }: OrderItemsModalProps) => {
  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <Typography level="h4" component="h2">
          Товары в заказе #{order.id}
        </Typography>
        <List>
          {order.products.map((item) => (
            <ListItem key={item.id}>
              <ListItemContent>
                <Typography level="body-md">
                  {item.product.name}
                </Typography>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  Количество: {item.quantity} шт.
                </Typography>
              </ListItemContent>
            </ListItem>
          ))}
        </List>
        <Button
          color="primary"
          onClick={onComplete}
          sx={{ mt: 2 }}
        >
          Завершить сборку
        </Button>
      </ModalDialog>
    </Modal>
  );
}; 