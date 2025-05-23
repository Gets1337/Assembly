import { Modal, ModalDialog, ModalClose, Typography, Button, Box } from '@mui/joy';
import { OrderModalProps } from '../types';
import { useState } from 'react';

export const OrderModal = ({ open, onClose, onConfirm, totalAmount }: OrderModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
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
        <Typography level="h4" sx={{ mb: 2 }}>
          Оформление заказа
        </Typography>
        
        <Typography level="body-md" sx={{ mb: 2 }}>
          Сумма заказа: {totalAmount} ₽
        </Typography>

        <Typography level="body-md" sx={{ mb: 3 }}>
          Оплата производится при получении заказа
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="plain"
            color="neutral"
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button
            onClick={handleConfirm}
            loading={isLoading}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
              },
            }}
          >
            Подтвердить заказ
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}; 