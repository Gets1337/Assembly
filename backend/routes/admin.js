import express from 'express';
import { isAdmin, authenticateToken } from '../middleware/auth.js';
import { adminController } from '../controllers/admin.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authenticateToken);

// Заказы
router.get('/orders/active', isAdmin, adminController.getActiveOrders);
router.get('/orders/history', isAdmin, adminController.getOrderHistory);
router.get('/orders/statuses', isAdmin, adminController.getOrderStatuses);

// CRUD операции для заказов
router.get('/orders/:id', isAdmin, adminController.getOrderById);
router.put('/orders/:id/status', isAdmin, adminController.updateOrderStatus);
router.put('/orders/:id', isAdmin, adminController.updateOrder);
router.put('/orders/:id/products', isAdmin, adminController.updateOrderProducts);
router.post('/orders', isAdmin, adminController.createOrder);
router.delete('/orders/:id', isAdmin, adminController.deleteOrder);

// Пользователи
router.get('/users', isAdmin, adminController.getUsers);
router.put('/users/:id', isAdmin, adminController.updateUser);
router.post('/users', isAdmin, adminController.createUser);
router.delete('/users/:id', isAdmin, adminController.deleteUser);

// Товары
router.get('/products', isAdmin, adminController.getProducts);
router.put('/products/:id', isAdmin, adminController.updateProduct);
router.post('/products', isAdmin, adminController.createProduct);
router.delete('/products/:id', isAdmin, adminController.deleteProduct);

export { router as admin };