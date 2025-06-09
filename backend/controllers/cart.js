import { CartModel } from "../models/cart.js";
import { CartItemModel } from "../models/cartItem.js";
import { ProductModel } from "../models/product.js";

export const cartController = {
  // Получить корзину пользователя
  async getCart(req, res) {
    try {
      const userId = req.user.userId;
      
      let cart = await CartModel.findByUserId(userId);

      if (!cart) {
        cart = await CartModel.create({
          user_id: userId,
          items: {}
        });
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Добавить товар в корзину
  async addItem(req, res) {
    try {
      const userId = req.user.userId;
      const { productId, quantity } = req.body;

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Неверные данные товара' });
      }

      const product = await ProductModel.getById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
      }

      if (product.stock_quantity < quantity) {
        return res.status(400).json({ error: 'Недостаточное количество товара на складе' });
      }

      let cart = await CartModel.findByUserId(userId);

      if (!cart) {
        cart = await CartModel.create({
          user_id: userId
        });
      }

      const existingItem = await CartItemModel.findByCartAndProduct(cart.id, productId);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (product.stock_quantity < newQuantity) {
          return res.status(400).json({ error: 'Недостаточное количество товара на складе' });
        }
        
        await CartItemModel.update(existingItem.id, { quantity: newQuantity });
      } else {
        await CartItemModel.create({
          cart_id: cart.id,
          product_id: productId,
          quantity
        });
      }

      const updatedCart = await CartModel.findByUserId(userId);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Обновить количество товара в корзине
  async updateItem(req, res) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
      const userId = req.user.userId;

      const cartItem = await CartItemModel.findById(parseInt(itemId));

      if (!cartItem) {
        return res.status(404).json({ error: 'Товар в корзине не найден' });
      }

      if (cartItem.cart.user_id !== userId) {
        return res.status(403).json({ error: 'Нет доступа к этой корзине' });
      }

      if (cartItem.product.stock_quantity < quantity) {
        return res.status(400).json({ error: 'Недостаточное количество товара на складе' });
      }

      const updatedItem = await CartItemModel.update(parseInt(itemId), { quantity });
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Удалить товар из корзины
  async removeItem(req, res) {
    try {
      const { itemId } = req.params;
      const userId = req.user.userId;

      const cartItem = await CartItemModel.findById(parseInt(itemId));

      if (!cartItem) {
        return res.status(404).json({ error: 'Товар в корзине не найден' });
      }

      if (cartItem.cart.user_id !== userId) {
        return res.status(403).json({ error: 'Нет доступа к этой корзине' });
      }

      await CartItemModel.delete(parseInt(itemId));
      res.json({ message: 'Товар удален из корзины' });
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }
}; 