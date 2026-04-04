import { z } from "zod";

export const createItemSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(["ELECTRONICS","MUSICAL_INSTRUMENTS","VEHICLES","SPORTS_EQUIPMENT","TOOLS","CLOTHING","OTHER"]),
  pricePerDay: z.number().positive(),
  depositAmount: z.number().positive(),
  images: z.array(z.string()).optional().default([]),
  location: z.string().min(2),
});

export const updateItemSchema = createItemSchema.partial();

export const itemQuerySchema = z.object({
  category: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});