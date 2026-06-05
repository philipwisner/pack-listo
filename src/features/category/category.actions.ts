"use server";

import { protectedActionClient } from "@/lib/safe-action";
import { categoryService } from "@/features/category/category.service";
import { z } from "zod";
import { ResourceService } from "@/utils/supabase/resource.service";
import prisma from "@/lib/prisma";

const createCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  color: z.string().optional(),
});

const updateCategorySchema = createCategorySchema.extend({
  id: z.string(),
});

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

export const updateCategoryAction = protectedActionClient
  .schema(updateCategorySchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, ...data } = parsedInput;
    const category = await categoryService.update(id, data, {
      userId,
      enforceOwnership: true,
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
