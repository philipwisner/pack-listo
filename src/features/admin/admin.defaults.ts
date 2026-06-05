import prisma from "@/lib/prisma";
// import { Prisma } from "@prisma/client";
import { Prisma } from "@/generated/prisma/client";
import { cache } from "react";

// Types for your UI components
export type DefaultItem = Prisma.ItemGetPayload<{
  include: { category: true };
}>;

export type DefaultCategory = Prisma.CategoryGetPayload<{}>;
export type DefaultBagType = Prisma.BagTypeGetPayload<{}>;

// Using cache() ensures these are only queried once per request cycle
export const getDefaultCategories = cache(async () => {
  return prisma.category.findMany({
    where: { userId: null },
    orderBy: { name: "asc" },
  });
});

export const getDefaultBagTypes = cache(async () => {
  return prisma.bagType.findMany({
    where: { userId: null },
    orderBy: { name: "asc" },
  });
});

export const getDefaultItems = cache(async () => {
  return prisma.item.findMany({
    where: { userId: null },
    include: { category: true },
    orderBy: { name: "asc" },
  });
});
