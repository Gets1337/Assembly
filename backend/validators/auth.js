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
    if (!data.fullName) {
        errors.fullName = 'Имя обязательно';
    } else if (data.fullName.length < 2) {
        errors.fullName = 'Имя должно содержать минимум 2 символа';
    }

    // Проверка даты рождения
    if (!data.birthDate) {
        errors.birthDate = 'Дата рождения обязательна';
    } else {
        const birthDate = new Date(data.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (isNaN(birthDate.getTime())) {
            errors.birthDate = 'Некорректная дата рождения';
        } else if (birthDate.getFullYear() < 1900) {
            errors.birthDate = 'Год рождения не может быть меньше 1900';
        } else if (age < 18) {
            errors.birthDate = 'Возраст должен быть не менее 18 лет';
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