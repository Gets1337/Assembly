import { OrderModel } from "../models/order.js";

export const orderController = {
  // Создание нового заказа
  async create(req, res) {
    try {
      const orderData = req.body;
      const order = await OrderModel.create(orderData);
      res.status(201).json(order);
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      res.status(500).json({ error: 'Ошибка при создании заказа' });
    }
  },

  // Получение всех заказов
  async getAll(req, res) {
    try {
      const orders = await OrderModel.getAll();
      res.status(200).json(orders);
    } catch (error) {
      console.error('Ошибка при получении заказов:', error);
      res.status(500).json({ error: 'Ошибка при получении заказов' });
    }
  },

  // Получение заказа по ID
  async getById(req, res) {
    const { id } = req.params;
    try {
      const order = await OrderModel.getById(Number(id));
      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error('Ошибка при получении заказа:', error);
      res.status(500).json({ error: 'Ошибка при получении заказа' });
    }
  },

  // Обновление заказа
  async update(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const updatedOrder = await OrderModel.update(Number(id), updateData);
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Ошибка при обновлении заказа:', error);
      res.status(500).json({ error: 'Ошибка при обновлении заказа' });
    }
  },

  // Обновление статуса заказа
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status_id } = req.body;
    try {
      const updatedOrder = await OrderModel.updateStatus(Number(id), Number(status_id));
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Ошибка при обновлении статуса заказа:', error);
      res.status(500).json({ error: 'Ошибка при обновлении статуса заказа' });
    }
  },

  // Удаление заказа
  async delete(req, res) {
    const { id } = req.params;
    try {
      await OrderModel.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      console.error('Ошибка при удалении заказа:', error);
      res.status(500).json({ error: 'Ошибка при удалении заказа' });
    }
  },

  // Получение заказов пользователя
  async getByUserId(req, res) {
    const { userId } = req.params;
    try {
      const orders = await OrderModel.getByUserId(Number(userId));
      res.status(200).json(orders);
    } catch (error) {
      console.error('Ошибка при получении заказов пользователя:', error);
      res.status(500).json({ error: 'Ошибка при получении заказов пользователя' });
    }
  }
}; 