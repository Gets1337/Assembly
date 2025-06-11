import { CartModel } from "../models/cart.js";
import { CartItemModel } from "../models/cartItem.js";
import { ProductModel } from "../models/product.js";
import { ReserveModel } from "../models/reserve.js";

export const cartController = {
  // Получить корзину пользователя
  async getCart(req, res) {
    try {
      const userId = req.user.userId;
      
      let cart = await CartModel.findByUserId(userId);

      if (!cart) {
        cart = await CartModel.create({
          user_id: userId
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
      const { product_id, quantity } = req.body;

      if (!product_id || !quantity) {
        return res.status(400).json({ error: 'Необходимо указать ID товара и количество' });
      }

      if (quantity <= 0) {
        return res.status(400).json({ error: 'Количество товара должно быть больше нуля' });
      }

      const product = await ProductModel.getById(product_id);

      if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
      }

      if (product.stock_quantity <= 0) {
        return res.status(400).json({ error: 'Товар отсутствует на складе' });
      }

      let cart = await CartModel.findByUserId(userId);

      if (!cart) {
        cart = await CartModel.create({
          user_id: userId
        });
      }

      const existingItem = await CartItemModel.findByCartAndProduct(cart.id, product_id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock_quantity) {
          return res.status(400).json({ 
            error: 'Превышено максимальное количество товара',
            available: product.stock_quantity,
            current: existingItem.quantity,
            requested: newQuantity
          });
        }
        
        await CartItemModel.update(existingItem.id, { quantity: newQuantity });
        await ReserveModel.create({
          product_id: product_id,
          quantity: quantity,
          user_id: userId
        });
      } else {
        if (quantity > product.stock_quantity) {
          return res.status(400).json({ 
            error: 'Превышено максимальное количество товара',
            available: product.stock_quantity,
            requested: quantity
          });
        }

        const cartItem = await CartItemModel.create({
          cart_id: cart.id,
          product_id: product_id,
          quantity
        });

        await ReserveModel.create({
          product_id: product_id,
          quantity: quantity,
          user_id: userId
        });
      }

      // Уменьшаем количество товара на складе
      await ProductModel.updateStock(product_id, product.stock_quantity - quantity);

      // Получаем обновленную информацию о товаре и корзине
      const updatedProduct = await ProductModel.getById(product_id);
      const updatedCart = await CartModel.findByUserId(userId);
      const updatedItem = await CartItemModel.findByCartAndProduct(updatedCart.id, product_id);

      // Проверяем, достигнуто ли максимальное количество
      const isMaxQuantity = updatedItem.quantity >= updatedProduct.stock_quantity;

      res.json({
        cart: updatedCart,
        product: updatedProduct,
        isMaxQuantity,
        currentQuantity: updatedItem.quantity,
        availableQuantity: updatedProduct.stock_quantity
      });
    } catch (error) {
      console.error('Error in addItem:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Обновить количество товара в корзине
  async updateItem(req, res) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
      const userId = req.user.userId;

      if (!quantity) {
        return res.status(400).json({ error: 'Необходимо указать количество товара' });
      }

      if (quantity <= 0) {
        return res.status(400).json({ error: 'Количество товара должно быть больше нуля' });
      }

      const cartItem = await CartItemModel.findById(parseInt(itemId));

      if (!cartItem) {
        return res.status(404).json({ error: 'Товар в корзине не найден' });
      }

      if (cartItem.cart.user_id !== userId) {
        return res.status(403).json({ error: 'Нет доступа к этой корзине' });
      }

      const product = await ProductModel.getById(cartItem.product_id);
      const reserve = await ReserveModel.findByProductAndUser(cartItem.product_id, userId);

      // Вычисляем разницу между новым и текущим количеством
      const quantityDifference = quantity - cartItem.quantity;

      // Если пытаемся увеличить количество
      if (quantityDifference > 0) {
        // Проверяем, достаточно ли товара на складе для увеличения
        if (product.stock_quantity < quantityDifference) {
          return res.status(400).json({ 
            error: 'Недостаточное количество товара на складе',
            available: product.stock_quantity,
            current: cartItem.quantity,
            requested: quantity
          });
        }
      }

      // Обновляем количество в корзине
      await CartItemModel.update(parseInt(itemId), { quantity });

      // Обновляем резерв
      if (reserve) {
        await ReserveModel.update(reserve.id, { quantity });
      } else {
        await ReserveModel.create({
          product_id: cartItem.product_id,
          quantity: quantity,
          user_id: userId
        });
      }

      // Обновляем количество на складе
      await ProductModel.updateStock(cartItem.product_id, product.stock_quantity - quantityDifference);

      const updatedItem = await CartItemModel.findById(parseInt(itemId));
      const updatedProduct = await ProductModel.getById(cartItem.product_id);

      // Проверяем, достигнуто ли максимальное количество
      const isMaxQuantity = updatedItem.quantity >= updatedProduct.stock_quantity;

      res.json({
        cartItem: updatedItem,
        product: updatedProduct,
        isMaxQuantity,
        currentQuantity: updatedItem.quantity,
        availableQuantity: updatedProduct.stock_quantity
      });
    } catch (error) {
      console.error('Error in updateItem:', error);
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

      // Получаем информацию о товаре и резерве
      const product = await ProductModel.getById(cartItem.product_id);
      const reserve = await ReserveModel.findByProductAndUser(cartItem.product_id, userId);

      // Удаляем товар из корзины
      await CartItemModel.delete(parseInt(itemId));

      // Удаляем резерв
      if (reserve) {
        await ReserveModel.delete(reserve.id);
      }

      // Возвращаем количество товара на склад
      await ProductModel.updateStock(cartItem.product_id, product.stock_quantity + cartItem.quantity);

      res.json({ message: 'Товар удален из корзины' });
    } catch (error) {
      console.error('Error in removeItem:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }
}; 