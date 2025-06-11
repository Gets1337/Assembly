import express from 'express';
import { cartController } from '../controllers/cart.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authenticateToken);

// Получить корзину пользователя
router.get('/', cartController.getCart);

// Добавить товар в корзину
router.post('/items', cartController.addItem);

// Обновить количество товара в корзине
router.put('/items/:itemId', cartController.updateItem);

// Удалить товар из корзины
router.delete('/items/:itemId', cartController.removeItem);

export { router as cart }; 