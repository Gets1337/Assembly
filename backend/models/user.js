import { getPrismaClient } from "../db/index.js";

export const UserModel = {
  // Создание нового пользователя
  async create(userData) {
    return getPrismaClient().user.create({
      data: {
        birthDate: userData.birthDate,
        fullName: userData.fullName,
        login: userData.login,
        password: userData.password,
        role_id: userData.roleId
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
      data: updateData
    });
  },

  // Удаление пользователя
  async delete(id) {
    return getPrismaClient().user.delete({
      where: { id }
    });
  },
};