import "server-only";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export const itemService = {
  async getAll(userId: string) {
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
      include: { category: true },
      orderBy: { name: "asc" },
    });
  },

  async create(data: {
    name: string;
    defaultWeight?: number;
    userId: string;
    categoryId?: string | null;
    tags?: string[];
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
    data: Prisma.ItemUpdateInput,
    options: { userId?: string; enforceOwnership?: boolean } = {
      enforceOwnership: true,
    },
  ) {
    if (!id) throw new Error("Item ID is required for update.");

    const { userId, enforceOwnership } = options;

    const item = await prisma.item.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!item) throw new Error("Item not found");

    return prisma.item.update({
      where: {
        id,
        ...(enforceOwnership && userId ? { userId } : {}),
      },
      data,
    });

    // 1. If it's a system item, create a private copy
    // if (item.userId === null) {
    //   return prisma.item.create({
    //     data: {
    //       name: data.name ?? item.name,
    //       defaultWeight: data.defaultWeight ?? item.defaultWeight,
    //       userId: userId,
    //       categoryId: data.categoryId ?? item.categoryId,
    //       tags: data.tags ?? item.tags,
    //     },
    //   });
    // }

    // // 2. Standard update
    // return prisma.item.update({
    //   where: { id, userId },
    //   data: {
    //     name: data.name,
    //     defaultWeight: data.defaultWeight,
    //     categoryId: data.categoryId,
    //     tags: data.tags,
    //   },
    // });
  },

  async delete(
    id: string,
    options: { userId?: string; enforceOwnership?: boolean } = {
      enforceOwnership: true,
    },
  ) {
    const { userId, enforceOwnership } = options;

    // const item = await prisma.item.findUnique({ where: { id } });

    return prisma.item.delete({
      where: {
        id,
        ...(enforceOwnership && userId ? { userId } : {}),
      },
    });

    // if (item?.userId === null) {
    //   return prisma.hiddenSystemItem.upsert({
    //     where: { userId_itemId: { userId, itemId: id } },
    //     update: {},
    //     create: { userId, itemId: id },
    //   });
    // }

    // return prisma.item.delete({
    //   where: { id, userId },
    // });
  },
  async hide(id: string, userId: string) {
    // First, verify it's a global category (userId is null)
    const item = await prisma.item.findUnique({ where: { id } });

    if (item?.userId === null) {
      return prisma.hiddenSystemItem.create({
        data: { userId, itemId: id },
      });
    } else {
      return prisma.item.delete({ where: { id, userId } });
    }
  },
};
