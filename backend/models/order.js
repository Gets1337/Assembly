import { getPrismaClient } from "../db/index.js";

export const OrderModel = {
  // Создание нового заказа
  async create(data) {
    return await getPrismaClient().order.create({
      data: {
        user_id: Number(data.user_id),
        status_id: Number(data.status_id),
        payment_method: data.payment_method,
        total_amount: Number(data.total_amount),
        products: {
          create: data.products.map(product => ({
            productId: Number(product.productId),
            quantity: Number(product.quantity)
          }))
        }
      },
      include: {
        products: {
          include: {
            product: true
          }
        },
        status: true,
        user: true
      }
    });
  },

  // Получение заказа по ID
  async findById(id) {
    return await getPrismaClient().order.findUnique({
      where: { id: Number(id) },
      include: {
        products: {
          include: {
            product: true
          }
        },
        status: true,
        user: true,
        history: {
          include: {
            current_status: true,
            new_status: true
          }
        }
      }
    });
  },

  // Получение всех заказов пользователя
  async findByUserId(userId) {
    return await getPrismaClient().order.findMany({
      where: { user_id: Number(userId) },
      include: {
        products: {
          include: {
            product: true
          }
        },
        status: true,
        history: {
          include: {
            current_status: true,
            new_status: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  },

  // Обновление статуса заказа
  async updateStatus(id, newStatusId) {
    const order = await this.findById(id);
    if (!order) {
      throw new Error('Заказ не найден');
    }

    // Создаем запись в истории
    await getPrismaClient().orderHistory.create({
      data: {
        orderId: Number(id),
        currentStatusId: order.status_id,
        newStatusId: Number(newStatusId)
      }
    });

    // Обновляем статус заказа
    return await getPrismaClient().order.update({
      where: { id: Number(id) },
      data: {
        status_id: Number(newStatusId)
      },
      include: {
        products: {
          include: {
            product: true
          }
        },
        status: true,
        history: {
          include: {
            current_status: true,
            new_status: true
          }
        }
      }
    });
  },

  // Получение всех заказов
  async findAll() {
    return await getPrismaClient().order.findMany({
      include: {
        products: {
          include: {
            product: true
          }
        },
        status: true,
        user: true,
        history: {
          include: {
            current_status: true,
            new_status: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  },

  // Получение заказов по статусу
  async findByStatus(statusId) {
    return await getPrismaClient().order.findMany({
      where: { status_id: Number(statusId) },
      include: {
        products: {
          include: {
            product: true
          }
        },
        status: true,
        user: true,
        history: {
          include: {
            current_status: true,
            new_status: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  },

  // Получить статус заказа по имени
  async getStatusByName(name) {
    return getPrismaClient().orderStatus.findFirst({
      where: { name }
    });
  },

  // Создать запись в истории заказов
  async createHistoryRecord(orderId, currentStatusId, newStatusId) {
    return getPrismaClient().orderHistory.create({
      data: {
        orderId: Number(orderId),
        currentStatusId,
        newStatusId
      }
    });
  },

  // Получить пользователя по ID
  async getUserById(userId) {
    return getPrismaClient().user.findUnique({
      where: { id: userId }
    });
  },

  // Получить продукт по ID
  async getProductById(productId) {
    return getPrismaClient().product.findUnique({
      where: { id: productId }
    });
  },

  // Обновить количество товара на складе
  async updateProductStock(productId, newQuantity) {
    return getPrismaClient().product.update({
      where: { id: productId },
      data: { stock_quantity: newQuantity }
    });
  },

  // Получить корзину пользователя
  async getCartByUserId(userId) {
    return getPrismaClient().cart.findFirst({
      where: { user_id: userId }
    });
  },

  // Очистить корзину
  async clearCart(cartId) {
    return getPrismaClient().cartItem.deleteMany({
      where: { cart_id: cartId }
    });
  },

  // Удаление заказа
  async delete(id) {
    // Сначала удаляем связанные записи
    await getPrismaClient().orderProduct.deleteMany({
      where: { orderId: Number(id) }
    });

    await getPrismaClient().orderHistory.deleteMany({
      where: { orderId: Number(id) }
    });

    // Затем удаляем сам заказ
    return await getPrismaClient().order.delete({
      where: { id: Number(id) }
    });
  }
}; 