import "server-only";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

// Update the type definition to reflect the new structure
export type ItemWithCategory = Prisma.ItemGetPayload<{
  include: { category: true };
}>;

export const itemService = {
  async getAll(userId: string): Promise<ItemWithCategory[]> {
    const hiddenItems = await prisma.hiddenSystemItem.findMany({
      where: { userId },
      select: { itemId: true },
    });
    const hiddenItemIds = hiddenItems.map((h) => h.itemId);

    return prisma.item.findMany({
      where: {
        AND: [
          { OR: [{ userId: userId }, { userId: null }] },
          { NOT: { id: { in: hiddenItemIds } } },
        ],
      },
      include: { category: true }, // Updated from categories: true
      orderBy: { name: "asc" },
    });
  },

  async create(data: {
    name: string;
    defaultWeight?: number;
    userId: string;
    categoryId?: string; // Changed from categoryIds[]
    tags?: string[]; // Added tags
  }) {
    const { categoryId, tags, ...itemData } = data;
    return prisma.item.create({
      data: {
        ...itemData,
        categoryId: categoryId ?? null,
        tags: tags ?? [],
      },
    });
  },

  async update(
    id: string,
    userId: string,
    data: {
      name?: string;
      defaultWeight?: number;
      categoryId?: string;
      tags?: string[];
    },
  ) {
    const item = await prisma.item.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!item) throw new Error("Item not found");

    // 1. If it's a system item, create a private copy
    if (item.userId === null) {
      return prisma.item.create({
        data: {
          name: data.name ?? item.name,
          defaultWeight: data.defaultWeight ?? item.defaultWeight,
          userId: userId,
          categoryId: data.categoryId ?? item.categoryId,
          tags: data.tags ?? item.tags,
        },
      });
    }

    // 2. Standard update
    return prisma.item.update({
      where: { id, userId },
      data: {
        name: data.name,
        defaultWeight: data.defaultWeight,
        categoryId: data.categoryId,
        tags: data.tags,
      },
    });
  },

  async delete(id: string, userId: string) {
    const item = await prisma.item.findUnique({ where: { id } });

    if (item?.userId === null) {
      return prisma.hiddenSystemItem.upsert({
        where: { userId_itemId: { userId, itemId: id } },
        update: {},
        create: { userId, itemId: id },
      });
    }

    return prisma.item.delete({
      where: { id, userId },
    });
  },
};
