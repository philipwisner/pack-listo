"use server";

import { protectedActionClient } from "@/lib/safe-action";
import { itemService } from "@/features/item/item.service";
import { z } from "zod";

const createItemSchema = z.object({
  name: z.string().min(1),
  defaultWeight: z.number().optional(),
  categoryId: z.string().optional(),
});

export const createItemAction = protectedActionClient
  .schema(createItemSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const item = await itemService.create({
      ...parsedInput,
      userId,
    });
    return { success: true, item };
  });

const updateItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  defaultWeight: z.number().optional(),
  categoryId: z.string().optional(),
});

export const updateItemAction = protectedActionClient
  .schema(updateItemSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, ...data } = parsedInput;
    const item = await itemService.update(id, userId, data);
    return { success: true, item };
  });

export const deleteItemAction = protectedActionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    await itemService.delete(parsedInput.id, userId);
    return { success: true };
  });
