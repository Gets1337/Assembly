import express from 'express';
import { storageCellController } from '../controllers/storageCell.js';

const router = express.Router();

// Маршрут для создания ячейки
router.post('/', storageCellController.create);

// Маршрут для получения всех ячеек
router.get('/', storageCellController.getAll);

// Маршрут для получения ячейки по ID
router.get('/:id', storageCellController.getById);

// Маршрут для обновления ячейки
router.put('/:id', storageCellController.update);

// Маршрут для удаления ячейки
router.delete('/:id', storageCellController.delete);

export { router as storageCell };