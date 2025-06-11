import { getPrismaClient } from "../db/index.js";

export const adminController = {
  // Получение активных заказов
  getActiveOrders: async (req, res) => {
    try {
      // Сначала получим все статусы заказов
      const statuses = await getPrismaClient().orderStatus.findMany();

      // Получим все заказы для отладки
      const allOrders = await getPrismaClient().order.findMany({
        include: {
          status: true,
          user: true,
          products: {
            include: {
              product: true
            }
          }
        }
      });

      // Теперь получим активные заказы
      const orders = await getPrismaClient().order.findMany({
        where: {
          status: {
            name: {
              in: ['Created', 'Worked', 'Ready']
            }
          }
        },
        include: {
          user: {
            select: {
              full_name: true,
              login: true
            }
          },
          products: {
            include: {
              product: true
            }
          },
          status: true
        },
        orderBy: {
          created_at: 'desc'
        }
      });
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Получение истории заказов
  getOrderHistory: async (req, res) => {
    try {
      const orders = await getPrismaClient().order.findMany({
        where: {
          status: {
            name: 'Issued'
          }
        },
        include: {
          user: {
            select: {
              full_name: true,
              login: true
            }
          },
          products: {
            include: {
              product: true
            }
          },
          status: true
        },
        orderBy: {
          created_at: 'desc'
        }
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Получение списка пользователей
  getUsers: async (req, res) => {
    try {
      const users = await getPrismaClient().user.findMany({
        select: {
          id: true,
          full_name: true,
          login: true,
          role: true,
          birth_date: true
        }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Обновление пользователя
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { name, login, role, birth_date } = req.body;

    try {
      // Сначала найдем роль по имени
      const roleRecord = await getPrismaClient().role.findFirst({
        where: { name: role }
      });

      if (!roleRecord) {
        return res.status(400).json({ error: 'Указанная роль не существует' });
      }

      const updatedUser = await getPrismaClient().user.update({
        where: { id: parseInt(id) },
        data: {
          full_name: name,
          login: login,
          role_id: roleRecord.id,
          birth_date: new Date(birth_date)
        },
        select: {
          id: true,
          full_name: true,
          login: true,
          role: true,
          birth_date: true,
        }
      });
      res.json(updatedUser);
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Товары
  getProducts: async (req, res) => {
    try {
      const products = await getPrismaClient().product.findMany({
        orderBy: {
          created_at: 'desc'
        }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock_quantity, image_url } = req.body;

    try {
      const updatedProduct = await getPrismaClient().product.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          price: parseFloat(price),
          stock_quantity: parseInt(stock_quantity),
          image_url,
          updated_at: new Date()
        }
      });
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  createProduct: async (req, res) => {
    const { name, description, price, stock_quantity, image_url } = req.body;

    try {
      const newProduct = await getPrismaClient().product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          stock_quantity: parseInt(stock_quantity),
          image_url,
          created_at: new Date()
        }
      });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;

    try {
      await getPrismaClient().product.delete({
        where: { id: parseInt(id) }
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }
};

