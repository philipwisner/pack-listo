"use server";

import { protectedActionClient } from "@/lib/safe-action";
import { listService } from "@/services/list.service";
import { z } from "zod";

const createListSchema = z.object({
  name: z.string().min(1),
  destination: z.string().optional(),
  tripDate: z.date().optional(),
  lengthOfStay: z.number().int().positive().optional(),
  isTemplate: z.boolean().default(false),
});

export const createListAction = protectedActionClient
  .schema(createListSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const list = await listService.create({
      ...parsedInput,
      userId,
    });
    return { success: true, list };
  });

export const deleteListAction = protectedActionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    await listService.delete(parsedInput.id, userId);
    return { success: true };
  });
