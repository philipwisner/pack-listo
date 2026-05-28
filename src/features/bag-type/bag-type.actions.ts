"use server";

import { protectedActionClient } from "@/lib/safe-action";
import { bagTypeService } from "@/services/bag-type.service";
import { z } from "zod";

const createBagTypeSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const createBagTypeAction = protectedActionClient
  .schema(createBagTypeSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const bagType = await bagTypeService.create({
      ...parsedInput,
      userId,
    });
    return { success: true, bagType };
  });

const updateBagTypeSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const updateBagTypeAction = protectedActionClient
  .schema(updateBagTypeSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, ...data } = parsedInput;
    const bagType = await bagTypeService.update(id, userId, data);
    return { success: true, bagType };
  });

export const deleteBagTypeAction = protectedActionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    await bagTypeService.delete(parsedInput.id, userId);
    return { success: true };
  });
