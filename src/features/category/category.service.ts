import "server-only";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/browser";

export const categoryService = {
  async getAll(userId: string) {
    // 1. Get hidden IDs
    const hidden = await prisma.hiddenSystemCategory.findMany({
      where: { userId },
      select: { categoryId: true },
    });
    const hiddenIds = hidden.map((h) => h.categoryId);

    // 2. Fetch with exclusion
    return prisma.category.findMany({
      where: {
        AND: [
          { OR: [{ userId }, { userId: null }] },
          { id: { notIn: hiddenIds } },
        ],
      },
      orderBy: { name: "asc" },
    });
  },

  async create(data: {
    name: string;
    icon?: string;
    color?: string;
    userId: string;
  }) {
    return prisma.category.create({
      data,
    });
  },

  // async update(
  //   id: string,
  //   userId: string,
  //   data: { name?: string; icon?: string; color?: string },
  // ) {
  //   return prisma.category.update({
  //     where: { id, userId },
  //     data,
  //   });
  // },

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput,
    options: { userId?: string; enforceOwnership?: boolean } = {
      enforceOwnership: true,
    },
  ) {
    if (!id) throw new Error("Category ID i`s required for update.");

    const { userId, enforceOwnership } = options;

    return prisma.category.update({
      where: {
        id,
        ...(enforceOwnership && userId ? { userId } : {}),
      },
      data,
    });
  },

  async delete(
    id: string,
    options: { userId?: string; enforceOwnership?: boolean } = {
      enforceOwnership: true,
    },
  ) {
    const { userId, enforceOwnership } = options;

    return prisma.category.delete({
      where: {
        id,
        ...(enforceOwnership && userId ? { userId } : {}),
      },
    });
  },

  async hide(id: string, userId: string) {
    // First, verify it's a global category (userId is null)
    const category = await prisma.category.findUnique({ where: { id } });

    if (category?.userId === null) {
      return prisma.hiddenSystemCategory.create({
        data: { userId, categoryId: id },
      });
    } else {
      // If it's a user-owned category, perform a real delete
      return prisma.category.delete({ where: { id, userId } });
    }
  },

  // async delete(id: string, userId: string) {
  //   return prisma.category.delete({
  //     where: { id, userId },
  //   });
  // },
};
