import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Получить корзину пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    let cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user_id: userId,
          items: {}
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Добавить товар в корзину
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    // Валидация входных данных
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Неверные данные товара' });
    }

    // Проверка существования товара и его доступности
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Недостаточное количество товара на складе' });
    }

    let cart = await prisma.cart.findFirst({
      where: { user_id: userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user_id: userId
        }
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId
      }
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock_quantity < newQuantity) {
        return res.status(400).json({ error: 'Недостаточное количество товара на складе' });
      }
      
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          quantity
        }
      });
    }

    const updatedCart = await prisma.cart.findFirst({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Обновить количество товара в корзине
router.put('/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const updatedItem = await prisma.cartItem.update({
      where: { id: parseInt(itemId) },
      data: { quantity }
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Удалить товар из корзины
router.delete('/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) }
    });

    res.json({ message: 'Товар удален из корзины' });
  } catch (error) {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router; 