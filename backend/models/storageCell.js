import { getPrismaClient } from "../db/index.js";

export const StorageCellModel = {
  // Создание новой ячейки
  async create(cellData) {
    return getPrismaClient().storageCell.create({
      data: {
        description: cellData.description,
      },
    });
  },

  // Получение всех ячеек
  async getAll() {
    return getPrismaClient().storageCell.findMany();
  },

  // Получение ячейки по ID
  async getById(id) {
    return getPrismaClient().storageCell.findUnique({
      where: { id },
    });
  },

  // Обновление ячейки
  async update(id, cellData) {
    return getPrismaClient().storageCell.update({
      where: { id },
      data: cellData,
    });
  },

  // Удаление ячейки
  async delete(id) {
    return getPrismaClient().storageCell.delete({
      where: { id },
    });
  },
};