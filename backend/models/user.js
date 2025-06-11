import { getPrismaClient } from "../db/index.js";

export const UserModel = {
  // Создание нового пользователя
  async create(userData) {
    return getPrismaClient().user.create({
      data: {
        birth_date: userData.birth_date,
        full_name: userData.full_name,
        login: userData.login,
        password: userData.password,
        role_id: userData.role_id
      }
    });
  },

  // Получение всех пользователей
  async getAll() {
    return getPrismaClient().user.findMany({
      include: { role: true }
    });
  },

  // Получение пользователя по ID
  async getById(id) {
    return getPrismaClient().user.findUnique({
      where: { id },
      include: { role: true }
    });
  },

  // Поиск пользователя по логину
  async findByLogin(login) {
    return getPrismaClient().user.findUnique({
      where: { login }
    });
  },

  // Поиск пользователя по логину с ролью
  async findByLoginWithRole(login) {
    return getPrismaClient().user.findUnique({
      where: { login },
      include: { role: true }
    });
  },

  // Поиск роли по имени
  async findRoleByName(roleName) {
    return getPrismaClient().role.findUnique({
      where: { name: roleName }
    });
  },

  // Создание роли
  async createRole(roleName) {
    return getPrismaClient().role.create({
      data: { name: roleName }
    });
  },

  // Обновление данных пользователя
  async update(id, updateData) {
    return getPrismaClient().user.update({
      where: { id },
      data: {
        birth_date: updateData.birth_date,
        full_name: updateData.full_name,
        login: updateData.login,
        password: updateData.password,
        role_id: updateData.role_id
      }
    });
  },

  // Удаление пользователя
  async delete(id) {
    return getPrismaClient().user.delete({
      where: { id }
    });
  },
};