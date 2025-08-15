import { z } from 'zod';

const ingredientSchema = z.object({
  id: z
    .string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/), // Expecting Mongo ObjectId
  measure: z.string().max(64),
});

export const recipeSchema = z.object({
  title: z.string().max(64),
  description: z.string().max(200),
  time: z.string().max(64),
  calories: z.number().int().min(1).max(10000).nullable().optional(),
  category: z.string(),
  area: z.string().max(64).nullable().optional(),
  ingredients: z.array(ingredientSchema).min(2).max(16),
  instructions: z.string().max(1200),
  thumb: z.string().url().nullable().optional(),
  thumbPublicId: z.string().nullable().optional(),
});
