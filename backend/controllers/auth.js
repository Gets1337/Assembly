import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.js';
import { validateRegistration, validateLogin } from '../validators/auth.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authController = {
    async register(req, res) {
        try {
            const { login, password, fullName, birthDate } = req.body;

            // Валидация данных
            const validationErrors = validateRegistration({
                login,
                password,
                fullName: fullName,
                birthDate: birthDate
            });

            if (Object.keys(validationErrors).length > 0) {
                return res.status(400).json({ errors: validationErrors });
            }

            // Проверка существования пользователя
            const existingUser = await prisma.user.findUnique({
                where: { login }
            });

            if (existingUser) {
                return res.status(400).json({
                    errors: {
                        login: 'Пользователь с таким логином уже существует'
                    }
                });
            }

            let userRole = await prisma.role.findUnique({
                where: { name: 'user' }
            });

            if (!userRole) {
                userRole = await prisma.role.create({
                    data: { name: 'user' }
                });
            }

            // Хеширование пароля
            const hashedPassword = await bcrypt.hash(password, 10);

            // Создание пользователя
            const user = await UserModel.create({
                login,
                password: hashedPassword,
                fullName,
                birthDate: new Date(birthDate),
                roleId: userRole.id
            });

            // Создание токена
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
            res.status(500).json({
                errors: {
                    general: 'Произошла ошибка при регистрации'
                }
            });
        }
    },

    async login(req, res) {
        try {
            const { login, password } = req.body;

            // Валидация данных
            const validationErrors = validateLogin({
                login,
                password
            });

            if (Object.keys(validationErrors).length > 0) {
                return res.status(400).json({ errors: validationErrors });
            }

            // Поиск пользователя
            const user = await prisma.user.findUnique({
                where: { login },
                include: { role: true }
            });

            if (!user) {
                return res.status(401).json({
                    errors: {
                        login: 'Неверный логин или пароль'
                    }
                });
            }

            // Проверка пароля
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({
                    errors: {
                        login: 'Неверный логин или пароль'
                    }
                });
            }

            // Создание токена
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
            res.status(500).json({
                errors: {
                    general: 'Произошла ошибка при входе'
                }
            });
        }
    }
}; 