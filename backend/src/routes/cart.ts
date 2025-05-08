import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
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
    console.error('Ошибка при получении корзины:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Добавить товар в корзину
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

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
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
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
    console.error('Ошибка при добавлении товара в корзину:', error);
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
    console.error('Ошибка при обновлении товара в корзине:', error);
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
    console.error('Ошибка при удалении товара из корзины:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router; 