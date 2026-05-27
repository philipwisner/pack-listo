import { prisma } from "../db";

export async function getDefaultCategories() {
  return prisma.category.findMany({
    where: { userId: null },
    orderBy: { name: "asc" },
  });
}

export async function getDefaultBagTypes() {
  return prisma.bagType.findMany({
    where: { userId: null },
    orderBy: { name: "asc" },
  });
}

export async function getDefaultItems() {
  return prisma.item.findMany({
    where: { userId: null },
    include: { categories: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  });
}
