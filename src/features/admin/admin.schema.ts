import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export const BagTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export const ItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  defaultWeight: z.coerce.number().nullable(),
  categoryIds: z.array(z.string()).default([]),
});
