import "server-only";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/browser";

export const bagTypeService = {
  async getAll(userId: string) {
    // 1. Get hidden IDs
    const hidden = await prisma.hiddenSystemBagType.findMany({
      where: { userId },
      select: { bagTypeId: true },
    });
    const hiddenIds = hidden.map((h) => h.bagTypeId);

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
    return prisma.bagType.create({
      data,
    });
  },

  async update(
    id: string,
    data: Prisma.BagTypeUpdateInput,
    options: { userId?: string; enforceOwnership?: boolean } = {
      enforceOwnership: true,
    },
  ) {
    if (!id) throw new Error("BagType ID is required for update.");

    const { userId, enforceOwnership } = options;

    return prisma.bagType.update({
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

    return prisma.bagType.delete({
      where: {
        id,
        ...(enforceOwnership && userId ? { userId } : {}),
      },
    });
  },

  async hide(id: string, userId: string) {
    // First, verify it's a global category (userId is null)
    const bagType = await prisma.bagType.findUnique({ where: { id } });

    if (bagType?.userId === null) {
      return prisma.hiddenSystemBagType.create({
        data: { userId, bagTypeId: id },
      });
    } else {
      // If it's a user-owned category, perform a real delete
      return prisma.bagType.delete({ where: { id, userId } });
    }
  },
};
