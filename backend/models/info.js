import { getPrismaClient } from '../db/index.js';

export const InfoModel = {
  async create(infoData) {
    return getPrismaClient().info.create({
      data: {
        key: infoData.key,
        value: infoData.value,
      },
    });
  },

  async getAll() {
    return getPrismaClient().info.findMany();
  },

  async getById(id) {
    return getPrismaClient().info.findUnique({
      where: { id },
    });
  },

  async update(id, infoData) {
    return getPrismaClient().info.update({
      where: { id },
      data: infoData,
    });
  },

  async delete(id) {
    return getPrismaClient().info.delete({
      where: { id },
    });
  },
};