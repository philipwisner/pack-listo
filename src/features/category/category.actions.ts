"use server";
import { protectedActionClient } from "@/lib/safe-action";
import { categoryService } from "@/features/category/category.service";
import { z } from "zod";
import { ResourceService } from "@/utils/resource.service";
import prisma from "@/lib/prisma";
import { createCategorySchema, updateCategorySchema } from "./category.schemas";

export const getCategoriesAction = protectedActionClient.action(
  async ({ ctx: { userId } }) => {
    // Call the Engine to get the full, filtered, merged list
    return await ResourceService.getResources(
      userId,
      prisma.category,
      prisma.hiddenSystemCategory,
      "categoryId",
    );
  },
);

export const createCategoryAction = protectedActionClient
  .schema(createCategorySchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const category = await categoryService.create({
      ...parsedInput,
      userId,
    });

    return { success: true, category };
  });

//Need to handle editing SYSTEM CATEGORIES - DON'T ALLOW DELETE USE FORK AND EDIT
export const updateCategoryAction = protectedActionClient
  .schema(updateCategorySchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, ...data } = parsedInput;
    const category = await categoryService.update(id, data, {
      userId,
      enforceOwnership: false,
    });
    return { success: true, category };
  });

export const deleteCategoryAction = protectedActionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    // Switch from delete() to hide()
    await categoryService.hide(parsedInput.id, userId);
    return { success: true };
  });
