import 'server-only';
import prisma from "@/lib/prisma";

export const categoryService = {
  async getAll(userId: string) {
    return prisma.category.findMany({
      where: {
        OR: [
          { userId },
          { userId: null } // Global categories
        ]
      },
      orderBy: { name: 'asc' }
    });
  },

  async create(data: { name: string; icon?: string; color?: string; userId: string }) {
    return prisma.category.create({
      data
    });
  },

  async update(id: string, userId: string, data: { name?: string; icon?: string; color?: string }) {
    return prisma.category.update({
      where: { id, userId },
      data
    });
  },

  async delete(id: string, userId: string) {
    return prisma.category.delete({
      where: { id, userId }
    });
  }
};
