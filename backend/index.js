import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import info from './routes/info.js';
import storageCell from './routes/storageCell.js';
import user from './routes/user.js';
import product from './routes/product.js';
import order from './routes/order.js';
import cart from './routes/cart.js';
import { UserModel } from './models/user.js';

const prisma = new PrismaClient();
const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());

app.post('/api/auth/register', async (req, res) => {
  try {
    const { login, password, fullName, birthDate } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { login }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
    }
    let userRole = await prisma.role.findUnique({
      where: { name: 'user' }
    });

    if (!userRole) {
      userRole = await prisma.role.create({
        data: { name: 'user' }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      login,
      password: hashedPassword,
      fullName,
      birthDate: new Date(birthDate),
      roleId: userRole.id
    });

    const token = jwt.sign(
      { userId: user.id, role: userRole.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        login: user.login,
        fullName: user.fullName,
        birthDate: user.birthDate,
        role: userRole.name
      }
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { login },
      include: { role: true }
    });

    if (!user) {
      return res.status(400).json({ error: 'Неверный логин или пароль' });
    }

    // Проверяем пароль
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Неверный логин или пароль' });
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      { userId: user.id, role: user.role.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        login: user.login,
        fullName: user.fullName,
        birthDate: user.birthDate,
        role: user.role.name
      }
    });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ error: 'Ошибка при авторизации пользователя' });
  }
});

// Подключаем остальные маршруты
app.use('/api/infos', info);
app.use('/api/products', product);
app.use('/api/users', user);
app.use('/api/storage-cells', storageCell);
app.use('/api/orders', order);
app.use('/api/cart', cart);

app.use((req, res, next) => {
  res.status(404).send('Страница не найдена');
});

app.listen(port, () => {
  console.log(`Сервер запущен на: http://localhost:${port}`);
});