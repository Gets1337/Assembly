import { getPrismaClient } from "../db/index.js";
import bcrypt from 'bcrypt';

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
  },

  // Создание нового пользователя
  createUser: async (req, res) => {
    const { name, login, password, role, birth_date } = req.body;

    try {
      // Проверяем, что пользователь с таким логином не существует
      const existingUser = await getPrismaClient().user.findUnique({
        where: { login }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
      }

      // Находим роль по имени
      const roleRecord = await getPrismaClient().role.findFirst({
        where: { name: role }
      });

      if (!roleRecord) {
        return res.status(400).json({ error: 'Указанная роль не существует' });
      }

      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await getPrismaClient().user.create({
        data: {
          full_name: name,
          login: login,
          password: hashedPassword,
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
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Удаление пользователя
  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      // Проверяем, что пользователь существует
      const user = await getPrismaClient().user.findUnique({
        where: { id: parseInt(id) }
      });

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      // Удаляем пользователя
      await getPrismaClient().user.delete({
        where: { id: parseInt(id) }
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // === CRUD операции для заказов ===

  // Получение заказа по ID
  getOrderById: async (req, res) => {
    const { id } = req.params;

    try {
      const order = await getPrismaClient().order.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              login: true
            }
          },
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
            },
            orderBy: {
              created_at: 'desc'
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      res.json(order);
    } catch (error) {
      console.error('Ошибка при получении заказа:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Обновление статуса заказа
  updateOrderStatus: async (req, res) => {
    const { id } = req.params;
    const { status_name } = req.body;

    try {
      // Проверяем, что заказ существует
      const order = await getPrismaClient().order.findUnique({
        where: { id: parseInt(id) },
        include: {
          status: true
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      // Находим новый статус по имени
      const newStatus = await getPrismaClient().orderStatus.findFirst({
        where: { name: status_name }
      });

      if (!newStatus) {
        return res.status(400).json({ error: 'Указанный статус не существует' });
      }

      // Если статус не изменился, возвращаем текущий заказ
      if (order.status_id === newStatus.id) {
        return res.json(order);
      }

      // Создаем запись в истории
      await getPrismaClient().orderHistory.create({
        data: {
          order_id: parseInt(id),
          current_status_id: order.status_id,
          new_status_id: newStatus.id
        }
      });

      // Обновляем статус заказа
      const updatedOrder = await getPrismaClient().order.update({
        where: { id: parseInt(id) },
        data: {
          status_id: newStatus.id,
          updated_at: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              login: true
            }
          },
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
            },
            orderBy: {
              created_at: 'desc'
            }
          }
        }
      });

      res.json(updatedOrder);
    } catch (error) {
      console.error('Ошибка при обновлении статуса заказа:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Обновление заказа (статус, способ оплаты, общая сумма)
  updateOrder: async (req, res) => {
    const { id } = req.params;
    const { status_name, payment_method, total_amount } = req.body;

    try {
      // Проверяем, что заказ существует
      const order = await getPrismaClient().order.findUnique({
        where: { id: parseInt(id) },
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

      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      const updateData = {
        updated_at: new Date()
      };

      // Обновляем статус если передан
      if (status_name) {
        const newStatus = await getPrismaClient().orderStatus.findFirst({
          where: { name: status_name }
        });

        if (!newStatus) {
          return res.status(400).json({ error: 'Указанный статус не существует' });
        }

        // Если статус изменился, создаем запись в истории
        if (order.status_id !== newStatus.id) {
          await getPrismaClient().orderHistory.create({
            data: {
              order_id: parseInt(id),
              current_status_id: order.status_id,
              new_status_id: newStatus.id
            }
          });
        }

        updateData.status_id = newStatus.id;
      }

      // Обновляем способ оплаты если передан
      if (payment_method) {
        updateData.payment_method = payment_method;
      }

      // Обновляем общую сумму если передана
      if (total_amount !== undefined) {
        updateData.total_amount = parseFloat(total_amount);
      }

      const updatedOrder = await getPrismaClient().order.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              login: true
            }
          },
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
            },
            orderBy: {
              created_at: 'desc'
            }
          }
        }
      });

      res.json(updatedOrder);
    } catch (error) {
      console.error('Ошибка при обновлении заказа:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Обновление товаров в заказе
  updateOrderProducts: async (req, res) => {
    const { id } = req.params;
    const { products } = req.body;

    try {
      // Проверяем, что заказ существует
      const order = await getPrismaClient().order.findUnique({
        where: { id: parseInt(id) },
        include: {
          products: {
            include: {
              product: true
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      // Получаем текущие товары в заказе для сравнения
      const currentProducts = order.products;
      const newProducts = products || [];

      // Очищаем все резервы для текущих товаров
      for (const item of currentProducts) {
        await getPrismaClient().reserve.deleteMany({
          where: {
            product_id: item.product_id,
            user_id: order.user_id
          }
        });
      }

      // Удаляем все существующие товары в заказе
      await getPrismaClient().productInOrder.deleteMany({
        where: { order_id: parseInt(id) }
      });

      // Добавляем новые товары и создаем резервы
      if (newProducts.length > 0) {
        await getPrismaClient().productInOrder.createMany({
          data: newProducts.map(product => ({
            order_id: parseInt(id),
            product_id: parseInt(product.product_id),
            quantity: parseInt(product.quantity)
          }))
        });

        // Создаем резервы для новых товаров
        for (const product of newProducts) {
          await getPrismaClient().reserve.create({
            data: {
              product_id: parseInt(product.product_id),
              user_id: order.user_id,
              quantity: parseInt(product.quantity)
            }
          });
        }
      }

      // Пересчитываем общую сумму
      const orderProducts = await getPrismaClient().productInOrder.findMany({
        where: { order_id: parseInt(id) },
        include: {
          product: true
        }
      });

      const totalAmount = orderProducts.reduce((sum, item) => {
        return sum + (parseFloat(item.product.price) * item.quantity);
      }, 0);

      // Обновляем общую сумму заказа
      await getPrismaClient().order.update({
        where: { id: parseInt(id) },
        data: {
          total_amount: totalAmount,
          updated_at: new Date()
        }
      });

      // Возвращаем обновленный заказ
      const updatedOrder = await getPrismaClient().order.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              login: true
            }
          },
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
            },
            orderBy: {
              created_at: 'desc'
            }
          }
        }
      });

      res.json(updatedOrder);
    } catch (error) {
      console.error('Ошибка при обновлении товаров заказа:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Создание нового заказа
  createOrder: async (req, res) => {
    const { user_id, status_name, payment_method, products } = req.body;

    try {
      // Проверяем, что пользователь существует
      const user = await getPrismaClient().user.findUnique({
        where: { id: parseInt(user_id) }
      });

      if (!user) {
        return res.status(400).json({ error: 'Пользователь не найден' });
      }

      // Находим статус по имени
      const status = await getPrismaClient().orderStatus.findFirst({
        where: { name: status_name }
      });

      if (!status) {
        return res.status(400).json({ error: 'Указанный статус не существует' });
      }

      // Рассчитываем общую сумму
      let totalAmount = 0;
      if (products && products.length > 0) {
        for (const product of products) {
          const productInfo = await getPrismaClient().product.findUnique({
            where: { id: parseInt(product.product_id) }
          });
          if (productInfo) {
            totalAmount += parseFloat(productInfo.price) * parseInt(product.quantity);
          }
        }
      }

      // Создаем заказ
      const newOrder = await getPrismaClient().order.create({
        data: {
          user_id: parseInt(user_id),
          status_id: status.id,
          payment_method: payment_method || 'card',
          total_amount: totalAmount,
          products: {
            create: products ? products.map(product => ({
              product_id: parseInt(product.product_id),
              quantity: parseInt(product.quantity)
            })) : []
          }
        },
        include: {
          user: {
            select: {
              id: true,
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
        }
      });

      // Создаем резервы для товаров в заказе
      if (products && products.length > 0) {
        for (const product of products) {
          await getPrismaClient().reserve.create({
            data: {
              product_id: parseInt(product.product_id),
              user_id: parseInt(user_id),
              quantity: parseInt(product.quantity)
            }
          });
        }
      }

      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Удаление заказа
  deleteOrder: async (req, res) => {
    const { id } = req.params;

    try {
      // Проверяем, что заказ существует
      const order = await getPrismaClient().order.findUnique({
        where: { id: parseInt(id) },
        include: {
          products: {
            include: {
              product: true
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      // Очищаем резервы для товаров из этого заказа
      for (const item of order.products) {
        await getPrismaClient().reserve.deleteMany({
          where: {
            product_id: item.product_id,
            user_id: order.user_id
          }
        });
      }

      // Удаляем связанные записи
      await getPrismaClient().productInOrder.deleteMany({
        where: { order_id: parseInt(id) }
      });

      await getPrismaClient().orderHistory.deleteMany({
        where: { order_id: parseInt(id) }
      });

      // Удаляем заказ
      await getPrismaClient().order.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Ошибка при удалении заказа:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  },

  // Получение всех статусов заказов
  getOrderStatuses: async (req, res) => {
    try {
      const statuses = await getPrismaClient().orderStatus.findMany({
        orderBy: {
          id: 'asc'
        }
      });
      res.json(statuses);
    } catch (error) {
      console.error('Ошибка при получении статусов заказов:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }
};

