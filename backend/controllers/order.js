import { OrderModel } from "../models/order.js";
import { CartModel } from "../models/cart.js";
import { CartItemModel } from "../models/cartItem.js";

export const orderController = {
  // Создание заказа
  async create(req, res) {
    try {
      const userId = req.user.userId;

      // Получаем корзину пользователя
      const cart = await CartModel.findByUserId(userId);
      if (!cart) {
        return res.status(404).json({ error: 'Корзина не найдена' });
      }

      // Получаем товары в корзине
      const cartItems = await CartItemModel.findByCartId(cart.id);
      if (!cartItems.length) {
        return res.status(400).json({ error: 'Корзина пуста' });
      }

      // Рассчитываем общую сумму
      const total_amount = cartItems.reduce((sum, item) => {
        return sum + (Number(item.product.price) * item.quantity);
      }, 0);

      // Создаем заказ
      const order = await OrderModel.create({
        user_id: userId,
        status_id: 1, // Статус "Created"
        payment_method: "cash", // Фиксированный способ оплаты
        total_amount,
        products: cartItems.map(item => ({
          productId: item.product_id,
          quantity: item.quantity
        }))
      });

      // Очищаем корзину
      await CartItemModel.deleteByCartId(cart.id);
      // await ReserveModel.deleteByCartId(cart.id); // TODO: Добавить модель резервирования если нужно

      res.json(order);
    } catch (error) {
      res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message 
      });
    }
  },

  // Получение всех заказов пользователя
  async getUserOrders(req, res) {
    try {
      const userId = req.user.userId;
      const orders = await OrderModel.findByUserId(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message 
      });
    }
  },

  // Получение заказа по ID
  async getOrder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      if (order.user_id !== userId) {
        return res.status(403).json({ error: 'Нет доступа к этому заказу' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message 
      });
    }
  },

  // Обновление статуса заказа (для работников)
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status_id } = req.body;

      const order = await OrderModel.updateStatus(id, status_id);
      res.json(order);
    } catch (error) {
      res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message 
      });
    }
  },

  // Получение всех заказов (для работников)
  async getAllOrders(req, res) {
    try {
      const orders = await OrderModel.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message 
      });
    }
  },

  // Получение заказов по статусу (для работников)
  async getOrdersByStatus(req, res) {
    try {
      const { status_id } = req.params;
      const orders = await OrderModel.findByStatus(status_id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message 
      });
    }
  },

  // Удаление заказа
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      if (order.user_id !== userId) {
        return res.status(403).json({ error: 'Нет доступа к этому заказу' });
      }

      await OrderModel.delete(id);
      res.json({ message: 'Заказ успешно удален' });
    } catch (error) {
      res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message 
      });
    }
  }
}; 