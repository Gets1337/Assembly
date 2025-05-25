import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.js';
import { validateRegistration, validateLogin } from '../validators/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authController = {
    async register(req, res) {
        try {
            const { login, password, fullName, birthDate } = req.body;
            const validationErrors = validateRegistration({
                login,
                password,
                fullName: fullName,
                birthDate: birthDate
            });

            if (Object.keys(validationErrors).length > 0) {
                return res.status(400).json({ errors: validationErrors });
            }

            const existingUser = await UserModel.findByLogin(login);

            if (existingUser) {
                return res.status(400).json({
                    errors: {
                        login: 'Пользователь с таким логином уже существует'
                    }
                });
            }

            let userRole = await UserModel.findRoleByName('user');

            if (!userRole) {
                userRole = await UserModel.createRole('user');
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

            const validationErrors = validateLogin({
                login,
                password
            });

            if (Object.keys(validationErrors).length > 0) {
                return res.status(400).json({ errors: validationErrors });
            }

            const user = await UserModel.findByLoginWithRole(login);

            if (!user) {
                return res.status(401).json({
                    errors: {
                        login: 'Неверный логин или пароль'
                    }
                });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({
                    errors: {
                        login: 'Неверный логин или пароль'
                    }
                });
            }

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