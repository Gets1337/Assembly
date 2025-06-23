import React, { useEffect, useState } from 'react';
import {
  Table,
  Sheet,
  Typography,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Input,
  Box,
  IconButton,
  useTheme,
  AspectRatio
} from '@mui/joy';
import { useMediaQuery } from '@mui/material';
import { useAdminStore } from '../../store/adminStore';
import { Product } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const ProductManagement: React.FC = () => {
  const { products, isLoading, error, fetchProducts, updateProduct, deleteProduct, createProduct } = useAdminStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: ''
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      image_url: product.image_url || ''
    });
    setOpenDialog(true);
  };

  const handleAddClick = () => {
    setSelectedProduct(null);
    setEditForm({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      image_url: ''
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      const productData = {
        ...editForm,
        price: parseFloat(editForm.price),
        stock_quantity: parseInt(editForm.stock_quantity)
      };

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Ошибка при сохранении товара:', error);
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Ошибка при удалении товара:', error);
      }
    }
  };

  if (isLoading.products) {
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

  if (error.products) {
    return (
      <Box sx={{ 
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <Typography color="danger">{error.products}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      gap: 2
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          startDecorator={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
            },
          }}
        >
          Добавить товар
        </Button>
      </Box>

      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {products && products.length > 0 ? (
            products.map((product) => (
              <Sheet
                key={product.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <AspectRatio
                    ratio="1"
                    sx={{
                      width: 100,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      bgcolor: 'background.level1'
                    }}
                  >
                    <img
                      src={product.image_url ?? ''}
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
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography level="title-md">{product.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleEditClick(product)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="danger"
                          onClick={() => handleDelete(product.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography level="body-sm" textColor="neutral.500" sx={{ mb: 1 }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography level="body-sm">
                        Цена: {product.price} ₽
                      </Typography>
                      <Typography level="body-sm">
                        В наличии: {product.stock_quantity}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Sheet>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>Нет товаров</Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Sheet 
          variant="outlined"
          sx={{
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Изображение</th>
                <th>Название</th>
                <th>Описание</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <AspectRatio
                        ratio="1"
                        sx={{
                          width: 60,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          bgcolor: 'background.level1'
                        }}
                      >
                        <img
                          src={product.image_url ?? ''}
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
                    </td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price} ₽</td>
                    <td>{product.stock_quantity}</td>
                    <td>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleEditClick(product)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="danger"
                          onClick={() => handleDelete(product.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center' }}>
                    <Typography>Нет товаров</Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Sheet>
      )}

      <Modal open={openDialog} onClose={() => setOpenDialog(false)}>
        <ModalDialog
          sx={{
            maxWidth: 500,
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }}
        >
          <ModalClose />
          <Typography level="h4" sx={{ mb: 2 }}>
            {selectedProduct ? 'Редактирование товара' : 'Добавление товара'}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel>Название</FormLabel>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Описание</FormLabel>
              <Input
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Цена</FormLabel>
              <Input
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Количество</FormLabel>
              <Input
                type="number"
                value={editForm.stock_quantity}
                onChange={(e) => setEditForm({ ...editForm, stock_quantity: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>URL изображения</FormLabel>
              <Input
                value={editForm.image_url}
                onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
              />
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setOpenDialog(false)}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                  },
                }}
              >
                Сохранить
              </Button>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default ProductManagement; 