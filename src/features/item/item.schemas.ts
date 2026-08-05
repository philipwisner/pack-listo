import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  defaultWeight: z.number().optional(),
  categoryId: z.string().nullable().optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;

export const updateItemSchema = createItemSchema.extend({
  id: z.string().min(1, "Item ID is required"),
});
