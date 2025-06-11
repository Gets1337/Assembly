import { getPrismaClient } from "../db/index.js";

export const ProductModel = {
  // Создание нового продукта
  async create(productData) {
    return getPrismaClient().product.create({
      data: {
        name: productData.name,
        description: productData.description,
        image_url: productData.image_url,
        stock_quantity: productData.stock_quantity,
        price: productData.price
      },
    });
  },

  // Получить все продукты
  async getAll() {
    const products = await getPrismaClient().product.findMany();
    return products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      image_url: product.image_url,
      price: Number(product.price),
      stock_quantity: product.stock_quantity
    }));
  },

  // Получить продукт по ID
  async getById(id) {
    const product = await getPrismaClient().product.findUnique({
      where: { id },
    });
    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      image_url: product.image_url,
      price: Number(product.price),
      stock_quantity: product.stock_quantity
    };
  },

  // Обновить данные продукта
  async update(id, updateData) {
    return getPrismaClient().product.update({
      where: { id },
      data: {
        name: updateData.name,
        description: updateData.description,
        image_url: updateData.image_url,
        stock_quantity: updateData.stock_quantity,
        price: updateData.price
      },
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