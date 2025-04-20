import { getPrismaClient } from "../db/index.js";

export const OrderModel = {
  // Создание нового заказа
  async create(orderData) {
    return getPrismaClient().order.create({
      data: orderData,
      include: {
        user: true,
        status: true,
        products: {
          include: {
            product: true
          }
        }
      }
    });
  },

  // Получить все заказы
  async getAll() {
    return getPrismaClient().order.findMany({
      include: {
        user: true,
        status: true,
        products: {
          include: {
            product: true
          }
        }
      }
    });
  },

  // Получить заказ по ID
  async getById(id) {
    return getPrismaClient().order.findUnique({
      where: { id },
      include: {
        user: true,
        status: true,
        products: {
          include: {
            product: true
          }
        },
        history: {
          include: {
            current_status: true,
            new_status: true
          }
        }
      }
    });
  },

  // Обновить данные заказа
  async update(id, updateData) {
    return getPrismaClient().order.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        status: true,
        products: {
          include: {
            product: true
          }
        }
      }
    });
  },

  // Обновить статус заказа
  async updateStatus(id, statusId) {
    // Сначала получаем текущий заказ
    const order = await getPrismaClient().order.findUnique({
      where: { id },
      include: { status: true }
    });

    if (!order) {
      return null;
    }

    // Создаем запись в истории заказов
    await getPrismaClient().orderHistory.create({
      data: {
        orderId: id,
        currentStatusId: order.status_id,
        newStatusId: statusId
      }
    });

    // Обновляем статус заказа
    return getPrismaClient().order.update({
      where: { id },
      data: { status_id: statusId },
      include: {
        user: true,
        status: true,
        products: {
          include: {
            product: true
          }
        }
      }
    });
  },

  // Удалить заказ
  async delete(id) {
    return getPrismaClient().order.delete({
      where: { id }
    });
  },

  // Получить заказы пользователя
  async getByUserId(userId) {
    return getPrismaClient().order.findMany({
      where: { user_id: userId },
      include: {
        status: true,
        products: {
          include: {
            product: true
          }
        }
      }
    });
  }
}; 