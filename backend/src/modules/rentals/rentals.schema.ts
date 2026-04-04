import { z } from "zod";

export const createRentalSchema = z.object({
  itemId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).refine((d) => d.endDate > d.startDate, { message: "endDate must be after startDate" });

export const updateRentalStatusSchema = z.object({
  action: z.enum(["approve", "reject", "cancel", "pay_deposit", "confirm_return", "dispute"]),
  note: z.string().optional(),
  conditionNote: z.string().optional(),
  conditionImages: z.array(z.string()).optional(),
});