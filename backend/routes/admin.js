import express from 'express';
import { isAdmin, authenticateToken } from '../middleware/auth.js';
import { adminController } from '../controllers/admin.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authenticateToken);

// Заказы
router.get('/orders/active', isAdmin, adminController.getActiveOrders);
router.get('/orders/history', isAdmin, adminController.getOrderHistory);

// Пользователи
router.get('/users', isAdmin, adminController.getUsers);
router.put('/users/:id', isAdmin, adminController.updateUser);

// Товары
router.get('/products', isAdmin, adminController.getProducts);
router.put('/products/:id', isAdmin, adminController.updateProduct);
router.post('/products', isAdmin, adminController.createProduct);
router.delete('/products/:id', isAdmin, adminController.deleteProduct);

export { router as admin };