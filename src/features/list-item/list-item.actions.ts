'use server';

import { protectedActionClient } from "@/lib/safe-action";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const toggleItemSchema = z.object({
  listId: z.string(),
  itemId: z.string(),
});

export const togglePackedAction = protectedActionClient
  .schema(z.object({ listItemId: z.string(), isPacked: z.boolean() }))
  .action(async ({ parsedInput }) => {
    const updated = await prisma.listItem.update({
      where: { id: parsedInput.listItemId },
      data: { isPacked: parsedInput.isPacked }
    });
    revalidatePath(`/lists/${updated.listId}`);
    return { success: true };
  });

export const addToListAction = protectedActionClient
  .schema(z.object({ listId: z.string(), itemId: z.string() }))
  .action(async ({ parsedInput }) => {
    const newItem = await prisma.listItem.create({
      data: {
        listId: parsedInput.listId,
        itemId: parsedInput.itemId,
        quantity: 1,
      }
    });
    revalidatePath(`/lists/${parsedInput.listId}`);
    return { success: true, newItem };
  });

export const removeFromListAction = protectedActionClient
  .schema(z.object({ listItemId: z.string() }))
  .action(async ({ parsedInput }) => {
    const deleted = await prisma.listItem.delete({
      where: { id: parsedInput.listItemId }
    });
    revalidatePath(`/lists/${deleted.listId}`);
    return { success: true };
  });
