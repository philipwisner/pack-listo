"use server";

import { protectedActionClient } from "@/lib/safe-action";
import { categoryService } from "@/services/category.service";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const createCategoryAction = protectedActionClient
  .schema(createCategorySchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const category = await categoryService.create({
      ...parsedInput,
      userId,
    });

    return { success: true, category };
  });

const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const updateCategoryAction = protectedActionClient
  .schema(updateCategorySchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, ...data } = parsedInput;
    const category = await categoryService.update(id, userId, data);
    return { success: true, category };
  });

export const deleteCategoryAction = protectedActionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    await categoryService.delete(parsedInput.id, userId);
    return { success: true };
  });
