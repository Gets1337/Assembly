import express from 'express';
import { orderController } from '../controllers/order.js';

const router = express.Router();

// Маршрут для создания заказа
router.post('/', orderController.create);

// Маршрут для получения всех заказов
router.get('/', orderController.getAll);

// Маршрут для получения заказа по ID
router.get('/:id', orderController.getById);

// Маршрут для получения заказов пользователя
router.get('/user/:userId', orderController.getByUserId);

// Маршрут для обновления заказа
router.put('/:id', orderController.update);

// Маршрут для обновления статуса заказа
router.patch('/:id/status', orderController.updateStatus);

// Маршрут для удаления заказа
router.delete('/:id', orderController.delete);

export default router; 