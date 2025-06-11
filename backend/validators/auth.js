import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const validateRegistration = (data) => {
    const errors = {};

    // Проверка логина
    if (!data.login) {
        errors.login = 'Логин обязателен';
    } else if (data.login.length < 3) {
        errors.login = 'Логин должен содержать минимум 3 символа';
    } else if (data.login.length > 30) {
        errors.login = 'Логин не должен превышать 30 символов';
    }

    // Проверка пароля
    if (!data.password) {
        errors.password = 'Пароль обязателен';
    } else if (data.password.length < 6) {
        errors.password = 'Пароль должен содержать минимум 6 символов';
    } else if (!/[A-Z]/.test(data.password)) {
        errors.password = 'Пароль должен содержать хотя бы одну заглавную букву';
    } else if (!/[0-9]/.test(data.password)) {
        errors.password = 'Пароль должен содержать хотя бы одну цифру';
    }

    // Проверка имени
    if (!data.full_name) {
        errors.full_name = 'Имя обязательно';
    } else if (data.full_name.length < 2) {
        errors.full_name = 'Имя должно содержать минимум 2 символа';
    }

    // Проверка даты рождения
    if (!data.birth_date) {
        errors.birth_date = 'Дата рождения обязательна';
    } else {
        const birthDate = new Date(data.birth_date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (isNaN(birthDate.getTime())) {
            errors.birth_date = 'Некорректная дата рождения';
        } else if (birthDate.getFullYear() < 1900) {
            errors.birth_date = 'Год рождения не может быть меньше 1900';
        } else if (age < 18) {
            errors.birth_date = 'Возраст должен быть не менее 18 лет';
        }
    }

    return errors;
};

export const validateLogin = (data) => {
    const errors = {};

    // Проверка логина
    if (!data.login) {
        errors.login = 'Логин обязателен';
    }

    // Проверка пароля
    if (!data.password) {
        errors.password = 'Пароль обязателен';
    }

    return errors;
}; 