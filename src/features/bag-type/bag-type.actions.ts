"use server";
import { protectedActionClient } from "@/lib/safe-action";
import { bagTypeService } from "@/features/bag-type/bag-type.service";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ResourceService } from "@/utils/resource.service";
import { createBagTypeSchema, updateBagTypeSchema } from "./bag-type.schemas";

export const getBagTypesAction = protectedActionClient.action(
  async ({ ctx: { userId } }) => {
    // Call the Engine to get the full, filtered, merged list
    return await ResourceService.getResources(
      userId,
      prisma.bagType,
      prisma.hiddenSystemBagType,
      "bagTypeId",
    );
  },
);

export const createBagTypeAction = protectedActionClient
  .schema(createBagTypeSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const bagType = await bagTypeService.create({
      ...parsedInput,
      userId,
    });
    return { success: true, bagType };
  });

//Need to handle editing SYSTEM BAGS - DON'T ALLOW DELETE FORK AND EDIT
export const updateBagTypeAction = protectedActionClient
  .schema(updateBagTypeSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, ...data } = parsedInput;
    const bagType = await bagTypeService.update(id, data, {
      userId,
      enforceOwnership: false,
    });
    return { success: true, bagType };
  });

export const deleteBagTypeAction = protectedActionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    // Switch from delete() to hide()
    await bagTypeService.hide(parsedInput.id, userId);
    return { success: true };
  });

// export const deleteBagTypeAction = protectedActionClient
//   .schema(z.object({ id: z.string() }))
//   .action(async ({ parsedInput, ctx: { userId } }) => {
//     await bagTypeService.delete(parsedInput.id, userId);
//     return { success: true };
//   });
