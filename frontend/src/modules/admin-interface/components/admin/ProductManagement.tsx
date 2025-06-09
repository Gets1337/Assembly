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
  IconButton
} from '@mui/joy';
import { useAdminStore } from '../../store/adminStore';
import { Product } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
      <Box sx={{ p: 2 }}>
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  if (error.products) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="danger">{error.products}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%'
    }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleAddClick}>
          Добавить товар
        </Button>
      </Box>

      <Sheet variant="outlined">
        <Table>
          <thead>
            <tr>
              <th>ID</th>
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
                <td colSpan={6} style={{ textAlign: 'center' }}>
                  <Typography>Нет товаров</Typography>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>

      <Modal open={openDialog} onClose={() => setOpenDialog(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">
            {selectedProduct ? 'Редактирование товара' : 'Добавление товара'}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControl>
              <FormLabel>Название</FormLabel>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Описание</FormLabel>
              <Input
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Цена</FormLabel>
              <Input
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Количество</FormLabel>
              <Input
                type="number"
                value={editForm.stock_quantity}
                onChange={(e) => setEditForm({ ...editForm, stock_quantity: e.target.value })}
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>URL изображения</FormLabel>
              <Input
                value={editForm.image_url}
                onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
              />
            </FormControl>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setOpenDialog(false)}
              >
                Отмена
              </Button>
              <Button onClick={handleSave}>
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