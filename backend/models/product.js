import { getPrismaClient } from "../db/index.js";

export const ProductModel = {
  // Создание нового продукта
  async create(productData) {
    return getPrismaClient().product.create({
      data: productData,
    });
  },

  // Получить все продукты
  async getAll() {
    return getPrismaClient().product.findMany();
  },

  // Получить продукт по ID
  async getById(id) {
    return getPrismaClient().product.findUnique({
      where: { id },
    });
  },

  // Обновить данные продукта
  async update(id, updateData) {
    return getPrismaClient().product.update({
      where: { id },
      data: updateData,
    });
  },

  // Обновить только количество на складе
  async updateStock(id, quantity) {
    return getPrismaClient().product.update({
      where: { id },
      data: { stock_quantity: quantity },
    });
  },

  // Удалить продукт
  async delete(id) {
    return getPrismaClient().product.delete({
      where: { id },
    });
  },
};