import express from 'express';
import { orderController } from '../controllers/order.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authenticateToken);

// Маршрут для создания заказа
router.post('/', orderController.create);

// Маршрут для получения заказов по статусу
router.get('/status/:status_id', orderController.getOrdersByStatus);

// Маршрут для получения всех заказов
router.get('/', orderController.getAllOrders);

// Маршрут для получения заказа по ID
router.get('/:id', orderController.getOrder);

// Маршрут для обновления статуса заказа
router.patch('/:id/status', orderController.updateStatus);

// Маршрут для удаления заказа
router.delete('/:id', orderController.delete);

export { router as order }; 