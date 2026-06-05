import "server-only";
import prisma from "@/lib/prisma";

export const listService = {
  async getAll(userId: string) {
    return prisma.list.findMany({
      where: { userId },
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string, userId: string) {
    return prisma.list.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: { item: { include: { category: true } }, bagTypeRef: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  },

  async create(data: {
    name: string;
    destination?: string;
    tripDate?: Date;
    lengthOfStay?: number;
    isTemplate?: boolean;
    userId: string;
  }) {
    return prisma.list.create({
      data,
    });
  },

  async delete(id: string, userId: string) {
    return prisma.list.delete({
      where: { id, userId },
    });
  },
};
