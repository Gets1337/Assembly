import { getPrismaClient } from "../db/index.js";

export const ReserveModel = {
  // Создание нового резерва
  async create(data) {
    return await getPrismaClient().reserve.create({
      data: {
        product_id: data.product_id,
        quantity: data.quantity,
        user_id: data.user_id
      },
      include: {
        product: true
      }
    });
  },

  // Получение резерва по ID продукта и пользователя
  async findByProductAndUser(productId, userId) {
    return await getPrismaClient().reserve.findFirst({
      where: {
        product_id: productId,
        user_id: userId
      },
      include: {
        product: true
      }
    });
  },

  // Удаление всех резервов пользователя
  async deleteByUserId(userId) {
    return await getPrismaClient().reserve.deleteMany({
      where: {
        user_id: userId
      }
    });
  },

  // Удаление резерва
  async delete(id) {
    return await getPrismaClient().reserve.delete({
      where: { id }
    });
  },

  // Обновление резерва
  async update(id, data) {
    return await getPrismaClient().reserve.update({
      where: { id },
      data: {
        quantity: data.quantity
      },
      include: {
        product: true
      }
    });
  }
}; 