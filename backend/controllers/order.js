import { OrderModel } from "../models/order.js";
import { CartModel } from "../models/cart.js";
import { CartItemModel } from "../models/cartItem.js";
import { UserModel } from "../models/user.js";
import { ReserveModel } from "../models/reserve.js";

export const orderController = {
  // Создание заказа
  async create(req, res) {
    try {
      const userId = req.user.userId;
      const cart = await CartModel.findByUserId(userId);
      if (!cart) {
        return res.status(404).json({ error: 'Корзина не найдена' });
      }

      const cartItems = await CartItemModel.findByCartId(cart.id);
      if (!cartItems.length) {
        return res.status(400).json({ error: 'Корзина пуста' });
      }

      const total_amount = cartItems.reduce((sum, item) => {
        return sum + (Number(item.product.price) * item.quantity);
      }, 0);

      // Создаем заказ
      const order = await OrderModel.create({
        user_id: userId,
        status_id: 1, 
        payment_method: "cash", 
        total_amount,
        products: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      });

      // Очищаем корзину
      await CartItemModel.deleteByCartId(cart.id);
      
      // Очищаем резервы пользователя
      await ReserveModel.deleteByUserId(userId);

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

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status_id } = req.body;
      const userId = req.user.userId;
      const user = await UserModel.getById(userId);
      if (!user || user.role.name !== 'worker') {
        return res.status(403).json({ error: 'Нет прав для обновления статуса заказа' });
      }

      const order = await OrderModel.updateStatus(id, status_id);
      res.json(order);
    } catch (error) {
      res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message 
      });
    }
  },

  // Получение всех заказов (только для работников)
  async getAllOrders(req, res) {
    try {
      const userId = req.user.userId;
      const user = await UserModel.getById(userId);
      if (!user || user.role.name !== 'worker') {
        return res.status(403).json({ error: 'Нет прав для просмотра всех заказов' });
      }

      const orders = await OrderModel.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message 
      });
    }
  },

  // Получение заказов по статусу (только для работников)
  async getOrdersByStatus(req, res) {
    try {
      const { status_id } = req.params;
      const userId = req.user.userId;

      // Проверяем, является ли пользователь работником
      const user = await UserModel.getById(userId);
      if (!user || user.role.name !== 'worker') {
        return res.status(403).json({ error: 'Нет прав для просмотра заказов по статусу' });
      }

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