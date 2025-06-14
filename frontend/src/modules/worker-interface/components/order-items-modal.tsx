import { Modal, ModalDialog, ModalClose, Typography, List, ListItem, ListItemContent, Button, Checkbox, AspectRatio, Sheet, Box } from '@mui/joy';
import { Order } from '../types/order';
import { useState, useEffect } from 'react';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

  const handleCheckAll = () => {
    if (order) {
      const allChecked = order.products.every(item => checkedItems[item.id]);
      const newCheckedItems = order.products.reduce((acc, item) => ({
        ...acc,
        [item.id]: !allChecked
      }), {});
      setCheckedItems(newCheckedItems);
    }
  };

  const isAllChecked = order?.products.every(item => checkedItems[item.id]) ?? false;

  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          maxWidth: 500,
          width: '100%',
          borderRadius: 'xl',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
        }}
      >
        <ModalClose />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BuildIcon sx={{ color: 'primary.700', fontSize: 28 }} />
          <Typography 
            level="h4" 
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.700',
              textShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            Товары в заказе #{order.id}
          </Typography>
        </Box>

        <Button
          variant="soft"
          color="primary"
          onClick={handleCheckAll}
          startDecorator={<CheckCircleIcon />}
          sx={{
            mb: 2,
            width: '100%',
            fontWeight: 500,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
            }
          }}
        >
          {isAllChecked ? 'Снять все отметки' : 'Отметить все как собранные'}
        </Button>

        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {order.products.map((item) => (
            <Sheet
              key={item.id}
              variant="outlined"
              sx={{
                borderRadius: 'lg',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  bgcolor: 'background.level1',
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }
              }}
            >
              <ListItem>
                <ListItemContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2
                  }}>
                    <AspectRatio
                      ratio="1"
                      sx={{
                        width: 80,
                        borderRadius: 'md',
                        overflow: 'hidden',
                        bgcolor: 'background.level1',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        loading="lazy"
                        style={{ objectFit: 'cover' }}
                      />
                    </AspectRatio>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        level="title-md"
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 0.5,
                          textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                      >
                        {item.product.name}
                      </Typography>
                      <Typography 
                        level="body-sm" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <span 
                          style={{ 
                            display: 'inline-block',
                            width: 6, 
                            height: 6, 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--joy-palette-primary-500)',
                            boxShadow: '0 0 8px rgba(25, 118, 210, 0.5)'
                          }} 
                        />
                        Количество: {item.quantity} шт.
                      </Typography>
                    </Box>
                    <Checkbox
                      checked={checkedItems[item.id] || false}
                      onChange={() => handleCheckboxChange(item.id)}
                      label="Собрано"
                      sx={{
                        '& .MuiCheckbox-label': {
                          fontWeight: 500
                        },
                        '& .MuiCheckbox-checkbox': {
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.1)'
                          }
                        }
                      }}
                    />
                  </Box>
                </ListItemContent>
              </ListItem>
            </Sheet>
          ))}
        </List>
        <Button
          color="primary"
          onClick={onComplete}
          disabled={!isAllChecked}
          sx={{ 
            mt: 3,
            fontWeight: 500,
            width: '100%',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
            }
          }}
        >
          Завершить сборку
        </Button>
      </ModalDialog>
    </Modal>
  );
}; 