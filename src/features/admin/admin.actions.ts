"use server";

import { protectedActionClient } from "@/lib/safe-action";
import {
  CategorySchema,
  BagTypeSchema,
  ItemSchema,
} from "@/features/admin/admin.schema";
import { categoryService } from "@/features/category/category.service";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

// Base admin client (You can add an isAdmin check to your existing protectedActionClient)
const adminClient = protectedActionClient.use(async ({ next, ctx }) => {
  // Assuming your context already contains user info
  // You might want to add an isAdmin check here globally
  return next({ ctx });
});

export const createCategoryAction = adminClient
  .inputSchema(CategorySchema) // 👈 Updated
  .action(async ({ parsedInput: { name, icon, color } }) => {
    await prisma.category.create({ data: { name, icon, color, userId: null } });
    redirect("/admin");
  });

export const updateCategoryActionOld = adminClient
  .inputSchema(CategorySchema)
  .action(async ({ parsedInput: { id, name, icon, color } }) => {
    if (!id) throw new Error("ID required");
    await prisma.category.update({
      where: { id },
      data: { name, icon, color },
    });
    redirect("/admin");
  });

export const updateCategoryAction = adminClient
  .inputSchema(CategorySchema)
  .action(async ({ parsedInput: { id, ...data } }) => {
    if (!id) throw new Error("ID required");

    // Reuse the existing service instead of calling prisma directly
    await categoryService.update(id, data, { enforceOwnership: false });
    redirect("/admin");
  });

export const deleteCategoryAction = adminClient
  .inputSchema(z.object({ id: z.string() })) // 👈 Updated
  .action(async ({ parsedInput: { id } }) => {
    await prisma.category.delete({ where: { id } });
    redirect("/admin");
  });

export const createItemAction = adminClient
  .inputSchema(ItemSchema) // 👈 Updated
  .action(async ({ parsedInput: { name, defaultWeight, categoryIds } }) => {
    await prisma.item.create({
      data: {
        name,
        defaultWeight,
        userId: null,
        categories: { connect: categoryIds.map((id) => ({ id })) },
      },
    });
    redirect("/admin");
  });

export const updateItemAction = adminClient
  .inputSchema(ItemSchema) // 👈 Updated
  .action(async ({ parsedInput: { id, name, defaultWeight, categoryIds } }) => {
    if (!id) throw new Error("ID required");
    await prisma.item.update({
      where: { id },
      data: {
        name,
        defaultWeight,
        categories: { set: categoryIds.map((id) => ({ id })) },
      },
    });
    redirect("/admin");
  });

export const deleteItemAction = adminClient
  .inputSchema(z.object({ id: z.string() })) // 👈 Updated
  .action(async ({ parsedInput: { id } }) => {
    await prisma.item.delete({ where: { id } });
    redirect("/admin");
  });

export const createBagTypeAction = adminClient
  .inputSchema(BagTypeSchema) // 👈 Updated
  .action(async ({ parsedInput: { name, icon, color } }) => {
    await prisma.bagType.create({ data: { name, icon, color, userId: null } });
    redirect("/admin");
  });

export const updateBagTypeAction = adminClient
  .inputSchema(BagTypeSchema) // 👈 Updated
  .action(async ({ parsedInput: { id, name, icon, color } }) => {
    if (!id) throw new Error("ID required");
    await prisma.bagType.update({ where: { id }, data: { name, icon, color } });
    redirect("/admin");
  });

export const deleteBagTypeAction = adminClient
  .inputSchema(z.object({ id: z.string() })) // 👈 Updated
  .action(async ({ parsedInput: { id } }) => {
    await prisma.bagType.delete({ where: { id } });
    redirect("/admin");
  });
