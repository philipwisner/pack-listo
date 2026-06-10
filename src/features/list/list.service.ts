import "server-only";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

// Define the payload type once for consistency
export type ListWithDetails = Prisma.ListGetPayload<{
  include: {
    items: {
      include: {
        item: { include: { category: true } };
        bagType: true;
      };
    };
  };
}>;

export const listService = {
  async getAll(userId: string) {
    return prisma.list.findMany({
      where: { userId },
      include: {
        items: {
          include: { item: true }, // Include necessary relations
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string, userId: string): Promise<ListWithDetails | null> {
    const list = await prisma.list.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            item: { include: { category: true } },
            bagType: true,
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return list;
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
