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