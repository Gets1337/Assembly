import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Недействительный токен' });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await UserModel.getById(userId);
    
    if (!user || user.role.name !== 'admin') {
      return res.status(403).json({ error: 'Требуются права администратора' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}; 