import { UserModel } from "../models/user.js";

export const userController = {
  // Создание нового пользователя
  async create(req, res) {
    try {
      const userData = req.body;
      const user = await UserModel.create(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании пользователя' });
    }
  },

  // Получение всех пользователей
  async getAll(req, res) {
    try {
      const users = await UserModel.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
  },

  // Получение пользователя по ID
  async getById(req, res) {
    const { id } = req.params;
    try {
      const user = await UserModel.getById(Number(id));
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении пользователя' });
    }
  },

  // Обновление данных пользователя
  async update(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const updatedUser = await UserModel.update(Number(id), updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
    }
  },

  // Удаление пользователя
  async delete(req, res) {
    const { id } = req.params;
    try {
      await UserModel.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении пользователя' });
    }
  },
};