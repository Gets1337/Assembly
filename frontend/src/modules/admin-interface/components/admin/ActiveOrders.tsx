import React, { useEffect, useState } from 'react';
import {
  Table,
  Sheet,
  Typography,
  Box,
  useTheme,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  Select,
  Option,
  Input,
  Stack,
  IconButton,
  Tooltip
} from '@mui/joy';
import { useMediaQuery } from '@mui/material';
import { Edit, Delete, Warning } from '@mui/icons-material';
import { useAdminStore } from '../../store/adminStore';

const ActiveOrders: React.FC = () => {
  const { activeOrders, isLoading, error, fetchActiveOrders, deleteOrder, updateOrder, updateOrderProducts, products, fetchProducts } = useAdminStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Состояние для модальных окон
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    status_name: '',
    total_amount: '',
    products: [] as Array<{ product_id: number; quantity: number; product?: any }>
  });

  useEffect(() => {
    fetchActiveOrders();
    fetchProducts();
  }, [fetchActiveOrders, fetchProducts]);

  const handleEditClick = (order: any) => {
    setSelectedOrder(order);
    setEditForm({
      status_name: order.status.name,
      total_amount: order.total_amount.toString(),
      products: order.products.map((item: any) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        product: item.product
      }))
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (order: any) => {
    setSelectedOrder(order);
    setDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (selectedOrder) {
      // Обновляем статус и общую сумму
      await updateOrder(selectedOrder.id, {
        status_name: editForm.status_name,
        total_amount: parseFloat(editForm.total_amount)
      });
      
      // Обновляем товары в заказе
      await updateOrderProducts(selectedOrder.id, editForm.products.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity
      })));
      
      setEditModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedOrder) {
      await deleteOrder(selectedOrder.id);
      setDeleteModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const addProduct = () => {
    setEditForm(prev => ({
      ...prev,
      products: [...prev.products, { product_id: 0, quantity: 1, product: null }]
    }));
  };

  const removeProduct = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateProduct = (index: number, field: 'product_id' | 'quantity', value: any) => {
    setEditForm(prev => ({
      ...prev,
      products: prev.products.map((item, i) => {
        if (i === index) {
          if (field === 'product_id') {
            const product = products.find(p => p.id === parseInt(value));
            return { ...item, product_id: parseInt(value), product };
          }
          return { ...item, [field]: parseInt(value) };
        }
        return item;
      })
    }));
  };

  const calculateTotal = () => {
    return editForm.products.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id);
      return sum + (product ? Number(product.price) * item.quantity : 0);
    }, 0);
  };

  if (isLoading.activeOrders) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%', 
        minHeight: '400px'
      }}>
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  if (error.activeOrders) {
    return (
      <Box sx={{ 
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <Typography color="danger">{error.activeOrders}</Typography>
      </Box>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Created':
        return 'Создан';
      case 'Worked':
        return 'В работе';
      case 'Ready':
        return 'Готов к выдаче';
      case 'Issued':
        return 'Выдан';
      default:
        return status;
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
      borderRadius: '16px',
      p: { xs: 1, sm: 2, md: 3 }
    }}>
      <Sheet 
        variant="outlined" 
        sx={{ 
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          background: '#ffffff'
        }}
      >
        {isMobile ? (
          <Box sx={{ p: 2 }}>
            {activeOrders && activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <Sheet
                  key={order.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: '8px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ mb: 1 }}>
                    <Typography level="title-md">Заказ #{order.id}</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="soft"
                      color={getStatusColor(order.status.name)}
                      sx={{ 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        display: 'inline-block'
                      }}
                    >
                      {getStatusText(order.status.name)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography level="body-sm" textColor="neutral.500">
                      Пользователь:
                    </Typography>
                    <Typography>{order.user.full_name}</Typography>
                    <Typography level="body-sm" textColor="neutral.500">
                      {order.user.login}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography level="body-sm" textColor="neutral.500">
                      Дата создания:
                    </Typography>
                    <Typography>{formatDateTime(order.created_at)}</Typography>
                  </Box>
                  <Box>
                    <Typography level="body-sm" textColor="neutral.500" sx={{ mb: 0.5 }}>
                      Товары:
                    </Typography>
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      maxHeight: '150px',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '4px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#F7F7F7',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#DFE6E9',
                        borderRadius: '4px',
                        '&:hover': {
                          background: '#B2BEC3',
                        },
                      },
                    }}>
                      {order.products.map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            p: 1,
                            borderRadius: '4px',
                            background: '#F7F7F7',
                            fontSize: '0.75rem',
                          }}
                        >
                          <Box
                            sx={{
                              flexShrink: 0,
                              width: '30px',
                              height: '30px',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
                            }}
                          >
                            <img
                              src={item.product.image_url ?? ''}
                              alt={item.product.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                backgroundColor: '#F7F7F7'
                              }}
                            />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography level="body-xs" sx={{ 
                              fontWeight: 'bold',
                              wordBreak: 'break-word',
                              fontSize: '0.7rem'
                            }}>
                              {item.product.name}
                            </Typography>
                            <Typography level="body-xs" sx={{ 
                              color: '#636E72',
                              fontSize: '0.65rem'
                            }}>
                              {item.quantity} шт. × {item.product.price} ₽
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Tooltip title="Редактировать заказ">
                      <IconButton
                        size="sm"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditClick(order)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить заказ">
                      <IconButton
                        size="sm"
                        variant="outlined"
                        color="danger"
                        onClick={() => handleDeleteClick(order)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Sheet>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography>Нет активных заказов</Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Статус</th>
                <th>Пользователь</th>
                <th>Дата и время создания</th>
                <th>Товары</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders && activeOrders.length > 0 ? (
                activeOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <Typography
                        variant="soft"
                        color={getStatusColor(order.status.name)}
                        sx={{ 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          display: 'inline-block'
                        }}
                      >
                        {getStatusText(order.status.name)}
                      </Typography>
                    </td>
                    <td>
                      {order.user.full_name}
                      <br />
                      <Typography level="body-sm" textColor="neutral.500">
                        {order.user.login}
                      </Typography>
                    </td>
                    <td>
                      {formatDateTime(order.created_at)}
                    </td>
                    <td>
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        maxHeight: '150px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: '#F7F7F7',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: '#DFE6E9',
                          borderRadius: '4px',
                          '&:hover': {
                            background: '#B2BEC3',
                          },
                        },
                      }}>
                        {order.products.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              gap: 1,
                              alignItems: 'center',
                              p: 1,
                              borderRadius: '4px',
                              background: '#F7F7F7',
                              fontSize: '0.75rem',
                            }}
                          >
                            <Box
                              sx={{
                                flexShrink: 0,
                                width: '30px',
                                height: '30px',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
                              }}
                            >
                              <img
                                src={item.product.image_url ?? ''}
                                alt={item.product.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  backgroundColor: '#F7F7F7'
                                }}
                              />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography level="body-xs" sx={{ 
                                fontWeight: 'bold',
                                wordBreak: 'break-word',
                                fontSize: '0.7rem'
                              }}>
                                {item.product.name}
                              </Typography>
                              <Typography level="body-xs" sx={{ 
                                color: '#636E72',
                                fontSize: '0.65rem'
                              }}>
                                {item.quantity} шт. × {item.product.price} ₽
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </td>
                    <td>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Редактировать заказ">
                          <IconButton
                            size="sm"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleEditClick(order)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить заказ">
                          <IconButton
                            size="sm"
                            variant="outlined"
                            color="danger"
                            onClick={() => handleDeleteClick(order)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>
                    <Typography>Нет активных заказов</Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Sheet>

      {/* Модальное окно редактирования заказа */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalDialog size="lg">
          <ModalClose />
          <DialogTitle>Редактировать заказ #{selectedOrder?.id}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <FormControl>
                <FormLabel>Статус</FormLabel>
                <Select
                  value={editForm.status_name}
                  onChange={(_, value) => setEditForm(prev => ({ ...prev, status_name: value || '' }))}
                >
                  <Option value="Created">Создан</Option>
                  <Option value="Worked">В работе</Option>
                  <Option value="Ready">Готов к выдаче</Option>
                  <Option value="Issued">Выдан</Option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Товары в заказе</FormLabel>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                  {editForm.products.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                      <Select
                        value={item.product_id.toString()}
                        onChange={(_, value) => updateProduct(index, 'product_id', value)}
                        sx={{ minWidth: 200 }}
                      >
                        <Option value="0">Выберите товар</Option>
                        {products.map((product) => (
                          <Option key={product.id} value={product.id.toString()}>
                            {product.name} - {product.price} ₽
                          </Option>
                        ))}
                      </Select>
                      <Input
                        type="number"
                        value={item.quantity.toString()}
                        onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                        placeholder="Кол-во"
                        sx={{ width: 100 }}
                      />
                      <IconButton
                        size="sm"
                        variant="outlined"
                        color="danger"
                        onClick={() => removeProduct(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={addProduct}
                    sx={{ mt: 1 }}
                  >
                    Добавить товар
                  </Button>
                </Box>
              </FormControl>
              
              <FormControl>
                <FormLabel>Общая сумма (автоматически пересчитывается)</FormLabel>
                <Input
                  type="number"
                  value={calculateTotal().toFixed(2)}
                  disabled
                  placeholder="Сумма"
                />
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => setEditModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={handleEditSubmit}
                >
                  Сохранить
                </Button>
              </Box>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </Modal>

      {/* Модальное окно подтверждения удаления */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalDialog size="sm">
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning color="warning" />
              Подтверждение удаления
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 3 }}>
              Вы уверены, что хотите удалить заказ #{selectedOrder?.id}? 
              Это действие нельзя отменить.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => setDeleteModalOpen(false)}
              >
                Отмена
              </Button>
              <Button
                variant="solid"
                color="danger"
                onClick={handleDeleteConfirm}
              >
                Удалить
              </Button>
            </Box>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Created':
      return 'primary';
    case 'Worked':
      return 'warning';
    case 'Ready':
      return 'success';
    default:
      return 'neutral';
  }
};

export default ActiveOrders; 