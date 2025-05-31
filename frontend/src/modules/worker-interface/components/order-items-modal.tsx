import { Modal, ModalDialog, ModalClose, Typography, List, ListItem, ListItemContent, Button, Checkbox, AspectRatio } from '@mui/joy';
import { Order } from '../../../types/order';
import { useState, useEffect } from 'react';

interface OrderItemsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OrderItemsModal = ({ order, open, onClose, onComplete }: OrderItemsModalProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (order) {
      // Всегда инициализируем чекбоксы как неотмеченные
      const initialState = order.products.reduce((acc, item) => ({
        ...acc,
        [item.id]: false
      }), {});
      setCheckedItems(initialState);
    }
  }, [order]);

  const handleCheckboxChange = (itemId: number) => {
    const newCheckedItems = {
      ...checkedItems,
      [itemId]: !checkedItems[itemId]
    };
    setCheckedItems(newCheckedItems);
  };

  const isAllChecked = order?.products.every(item => checkedItems[item.id]) ?? false;

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <AspectRatio
                    ratio="1"
                    sx={{
                      width: 80,
                      borderRadius: 'sm',
                      overflow: 'hidden',
                      bgcolor: 'background.level1'
                    }}
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                    />
                  </AspectRatio>
                  <div style={{ flex: 1 }}>
                    <Typography level="body-md">
                      {item.product.name}
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                      Количество: {item.quantity} шт.
                    </Typography>
                  </div>
                  <Checkbox
                    checked={checkedItems[item.id] || false}
                    onChange={() => handleCheckboxChange(item.id)}
                    label="Собрано"
                  />
                </div>
              </ListItemContent>
            </ListItem>
          ))}
        </List>
        <Button
          color="primary"
          onClick={onComplete}
          disabled={!isAllChecked}
          sx={{ mt: 2 }}
        >
          Завершить сборку
        </Button>
      </ModalDialog>
    </Modal>
  );
}; 