import { getPrismaClient } from "../db/index.js";

export const CartItemModel = {
  // Создание нового элемента корзины
  async create(data) {
    return await getPrismaClient().cartItem.create({
      data: {
        cart_id: data.cart_id,
        product_id: data.product_id,
        quantity: data.quantity
      },
      include: {
        product: true
      }
    });
  },

  // Получение элемента корзины по ID
  async findById(id) {
    return await getPrismaClient().cartItem.findFirst({
      where: { id },
      include: {
        cart: true,
        product: true
      }
    });
  },

  // Получение всех элементов корзины по ID корзины
  async findByCartId(cartId) {
    return await getPrismaClient().cartItem.findMany({
      where: { cart_id: cartId },
      include: {
        product: true
      }
    });
  },

  // Получение элемента корзины по ID корзины и ID продукта
  async findByCartAndProduct(cartId, productId) {
    return await getPrismaClient().cartItem.findFirst({
      where: {
        cart_id: cartId,
        product_id: productId
      },
      include: {
        product: true
      }
    });
  },

  // Обновление элемента корзины
  async update(id, data) {
    return await getPrismaClient().cartItem.update({
      where: { id },
      data: {
        cart_id: data.cart_id,
        product_id: data.product_id,
        quantity: data.quantity
      },
      include: {
        product: true
      }
    });
  },

  // Удаление элемента корзины
  async delete(id) {
    return await getPrismaClient().cartItem.delete({
      where: { id }
    });
  },

  // Удаление всех элементов корзины
  async deleteByCartId(cartId) {
    return await getPrismaClient().cartItem.deleteMany({
      where: { cart_id: cartId }
    });
  }
}; 