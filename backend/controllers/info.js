import { InfoModel } from "../models/info.js";

export const infoController = {
  // Создание новой записи
  async create(req, res) {
    try {
      const { key, value } = req.body;
      const info = await InfoModel.create({ key, value });
      res.status(201).json(info);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании записи' });
    }
  },

  // Получение всех записей
  async getAll(req, res) {
    try {
      const info = await InfoModel.getAll();
      res.status(200).json(info);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении записей' });
    }
  },

  // Получение записи по ID
  async getById(req, res) {
    const { id } = req.params;
    try {
      const info = await InfoModel.getById(Number(id));
      if (!info) {
        return res.status(404).json({ error: 'Запись не найдена' });
      }
      res.status(200).json(info);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении записи' });
    }
  },

  // Обновление записи
  async update(req, res) {
    const { id } = req.params;
    const { key, value } = req.body;
    try {
      const updatedInfo = await InfoModel.update(Number(id), { key, value });
      if (!updatedInfo) {
        return res.status(404).json({ error: 'Запись не найдена' });
      }
      res.status(200).json(updatedInfo);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении записи' });
    }
  },

  // Удаление записи
  async delete(req, res) {
    const { id } = req.params;
    try {
      await InfoModel.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении записи' });
    }
  },
};