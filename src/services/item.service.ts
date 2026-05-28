import 'server-only';
import prisma from "@/lib/prisma";

export const itemService = {
  async getAll(userId: string) {
    return prisma.item.findMany({
      where: { userId },
      include: { categories: true },
      orderBy: { name: 'asc' }
    });
  },

  async create(data: { name: string; defaultWeight?: number; userId: string; categoryIds?: string[] }) {
    const { categoryIds, ...itemData } = data;
    return prisma.item.create({
      data: {
        ...itemData,
        categories: categoryIds ? {
          connect: categoryIds.map(id => ({ id }))
        } : undefined
      }
    });
  },

  async update(id: string, userId: string, data: { name?: string; defaultWeight?: number; categoryIds?: string[] }) {
    const { categoryIds, ...itemData } = data;
    return prisma.item.update({
      where: { id, userId },
      data: {
        ...itemData,
        categories: categoryIds ? {
          set: categoryIds.map(id => ({ id }))
        } : undefined
      }
    });
  },

  async delete(id: string, userId: string) {
    return prisma.item.delete({
      where: { id, userId }
    });
  }
};
