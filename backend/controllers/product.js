import { ProductModel } from "../models/product.js";

export const productController = {
  // Создание нового продукта
  async create(req, res) {
    try {
      const { name, description, image_url, stock_quantity, price } = req.body;
      const product = await ProductModel.create({
        name,
        description,
        image_url,
        stock_quantity,
        price
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании продукта' });
    }
  },

  // Получение всех продуктов
  async getAll(req, res) {
    try {
      const products = await ProductModel.getAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении продуктов' });
    }
  },

  // Получение продукта по ID
  async getById(req, res) {
    const { id } = req.params;
    try {
      const product = await ProductModel.getById(Number(id));
      if (!product) {
        return res.status(404).json({ error: 'Продукт не найден' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении продукта' });
    }
  },

  // Обновление продукта
  async update(req, res) {
    const { id } = req.params;
    const { name, description, image_url, stock_quantity, price } = req.body;
    try {
      const updatedProduct = await ProductModel.update(Number(id), {
        name,
        description,
        image_url,
        stock_quantity,
        price
      });
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Продукт не найден' });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении продукта' });
    }
  },

  // Обновление только количества на складе
  async updateStock(req, res) {
    const { id } = req.params;
    const { stock_quantity } = req.body;
    try {
      const updatedProduct = await ProductModel.updateStock(Number(id), stock_quantity);
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Продукт не найден' });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении количества на складе' });
    }
  },

  // Удаление продукта
  async delete(req, res) {
    const { id } = req.params;
    try {
      await ProductModel.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении продукта' });
    }
  },
};
