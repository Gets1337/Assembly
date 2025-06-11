import { getPrismaClient } from "../db/index.js";

export const CartModel = {
  // Создание новой корзины
  async create(data) {
    return await getPrismaClient().cart.create({
      data: {
        user_id: data.user_id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  },

  // Получение корзины по ID пользователя
  async findByUserId(userId) {
    return await getPrismaClient().cart.findFirst({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  },

  // Обновление корзины
  async update(id, data) {
    return await getPrismaClient().cart.update({
      where: { id },
      data: {
        user_id: data.user_id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  },

  // Удаление корзины
  async delete(id) {
    return await getPrismaClient().cart.delete({
      where: { id }
    });
  }
}; 