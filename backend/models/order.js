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
            product_id: Number(product.product_id),
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
        order_id: Number(id),
        current_status_id: order.status_id,
        new_status_id: newStatusId
      }
    });

    // Если новый статус "Issued" (id = 4), обновляем количество товара и удаляем резервы
    if (newStatusId === 4) {
      // Получаем все товары в заказе
      const productsInOrder = await getPrismaClient().productInOrder.findMany({
        where: { order_id: Number(id) },
        include: { product: true }
      });

      // Обновляем количество для каждого товара и удаляем резервы
      for (const item of productsInOrder) {
        const product = item.product;
        // Уменьшаем количество товара на складе
        await getPrismaClient().product.update({
          where: { id: product.id },
          data: { stock_quantity: product.stock_quantity - item.quantity }
        });

        // Удаляем резерв для этого товара
        await getPrismaClient().reserve.deleteMany({
          where: {
            product_id: product.id,
            user_id: order.user_id
          }
        });
      }
    }

    // Обновляем статус заказа
    return await getPrismaClient().order.update({
      where: { id: Number(id) },
      data: {
        status_id: newStatusId
      },
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
        order_id: Number(orderId),
        current_status_id: currentStatusId,
        new_status_id: newStatusId
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
    await getPrismaClient().productInOrder.deleteMany({
      where: { order_id: Number(id) }
    });

    await getPrismaClient().orderHistory.deleteMany({
      where: { order_id: Number(id) }
    });

    return await getPrismaClient().order.delete({
      where: { id: Number(id) }
    });
  }
}; 