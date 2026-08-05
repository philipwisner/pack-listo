import { z } from "zod";

export const createBagTypeSchema = z.object({
  name: z.string().min(1, "Bag name is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createBagTypeSchema>;

export const updateBagTypeSchema = createBagTypeSchema.extend({
  id: z.string().min(1, "Category ID is required"),
});
