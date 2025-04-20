import express from 'express';
import { userController } from '../controllers/user.js';

const router = express.Router();

// Маршрут для создания пользователя
router.post('/', userController.create);

// Маршрут для получения всех пользователей
router.get('/', userController.getAll);

// Маршрут для получения пользователя по ID
router.get('/:id', userController.getById);

// Маршрут для обновления пользователя
router.put('/:id', userController.update);

// Маршрут для удаления пользователя
router.delete('/:id', userController.delete);

export default router;