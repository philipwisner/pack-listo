"use server";
import { protectedActionClient } from "@/lib/safe-action";
import { itemService } from "@/features/item/item.service";
import { z } from "zod";
import { createItemSchema, updateItemSchema } from "./item.schemas";
import { ResourceService } from "@/utils/resource.service";

import prisma from "@/lib/prisma";

export const getItemsAction = protectedActionClient.action(
  async ({ ctx: { userId } }) => {
    return await ResourceService.getResources(
      userId,
      prisma.item,
      prisma.hiddenSystemItem,
      "itemId",
      { include: { category: true } },
    );
  },
);
export const createItemAction = protectedActionClient
  .schema(createItemSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const item = await itemService.create({
      ...parsedInput,
      userId,
    });
    return { success: true, item };
  });

//Need to handle editing SYSTEM ITEMS - DON'T ALLOW DELETE FORK AND EDIT
export const updateItemAction = protectedActionClient
  .schema(updateItemSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, ...data } = parsedInput;
    const item = await itemService.update(id, data, {
      userId,
      enforceOwnership: false,
    });
    return { success: true, item };
  });

export const deleteItemAction = protectedActionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    // Switch from delete() to hide()
    await itemService.hide(parsedInput.id, userId);
    return { success: true };
  });
