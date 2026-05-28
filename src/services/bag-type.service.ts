import 'server-only';
import prisma from "@/lib/prisma";

export const bagTypeService = {
  async getAll(userId: string) {
    return prisma.bagType.findMany({
      where: {
        OR: [
          { userId },
          { userId: null }
        ]
      },
      orderBy: { name: 'asc' }
    });
  },

  async create(data: { name: string; icon?: string; color?: string; userId: string }) {
    return prisma.bagType.create({
      data
    });
  },

  async update(id: string, userId: string, data: { name?: string; icon?: string; color?: string }) {
    return prisma.bagType.update({
      where: { id, userId },
      data
    });
  },

  async delete(id: string, userId: string) {
    return prisma.bagType.delete({
      where: { id, userId }
    });
  }
};
