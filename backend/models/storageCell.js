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
    return getPrismaClient().storageCell.findMany({
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });
  },

  // Получение ячейки по ID
  async getById(id) {
    return getPrismaClient().storageCell.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });
  },

  // Обновление ячейки
  async update(id, cellData) {
    return getPrismaClient().storageCell.update({
      where: { id },
      data: {
        description: cellData.description
      },
    });
  },

  // Удаление ячейки
  async delete(id) {
    return getPrismaClient().storageCell.delete({
      where: { id },
    });
  },
};