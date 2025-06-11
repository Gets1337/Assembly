import express from 'express';
import { infoController } from '../controllers/info.js';

const router = express.Router();

// Маршрут для создания записи
router.post('/', infoController.create);

// Маршрут для получения всех записей
router.get('/', infoController.getAll);

// Маршрут для получения записи по ID
router.get('/:id', infoController.getById);

// Маршрут для обновления записи
router.put('/:id', infoController.update);

// Маршрут для удаления записи
router.delete('/:id', infoController.delete);

export { router as info };