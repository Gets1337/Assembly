import { StorageCellModel } from "../models/storageCell.js";

export const storageCellController = {
  // Создание новой ячейки
  async create(req, res) {
    try {
      const { description } = req.body;
      const storageCell = await StorageCellModel.create({ description });
      res.status(201).json(storageCell);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании ячейки' });
    }
  },

  // Получение всех ячеек
  async getAll(req, res) {
    try {
      const storageCells = await StorageCellModel.getAll();
      res.status(200).json(storageCells);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении ячеек' });
    }
  },

  // Получение ячейки по ID
  async getById(req, res) {
    const { id } = req.params;
    try {
      const storageCell = await StorageCellModel.getById(Number(id));
      if (!storageCell) {
        return res.status(404).json({ error: 'Ячейка не найдена' });
      }
      res.status(200).json(storageCell);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении ячейки' });
    }
  },

  // Обновление ячейки
  async update(req, res) {
    const { id } = req.params;
    const { description } = req.body;
    try {
      const updatedStorageCell = await StorageCellModel.update(Number(id), { description });
      if (!updatedStorageCell) {
        return res.status(404).json({ error: 'Ячейка не найдена' });
      }
      res.status(200).json(updatedStorageCell);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении ячейки' });
    }
  },

  // Удаление ячейки
  async delete(req, res) {
    const { id } = req.params;
    try {
      await StorageCellModel.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении ячейки' });
    }
  },
};
