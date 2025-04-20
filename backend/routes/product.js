import express from 'express';
import { productController } from '../controllers/product.js';

const router = express.Router();

// Маршрут для создания продукта
router.post('/', productController.create);

// Маршрут для получения всех продуктов
router.get('/', productController.getAll);

// Маршрут для получения продукта по ID
router.get('/:id', productController.getById);

// Маршрут для обновления продукта
router.put('/:id', productController.update);

// Маршрут для удаления продукта
router.delete('/:id', productController.delete);

export default router;