import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { itemsService } from "./items.service";
import { itemQuerySchema } from "./items.schema";
import { asyncHandler } from "../../utils/asyncHandler";

export const createItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const item = await itemsService.create(req.userId!, req.body);
  res.status(201).json(item);
});

export const listItems = asyncHandler(async (req: Request, res: Response) => {
  const query = itemQuerySchema.parse(req.query);
  const result = await itemsService.list(query);
  res.json(result);
});

export const getItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await itemsService.getById(req.params.id as string);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

export const updateItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const item = await itemsService.update(req.params.id as string, req.userId!, req.body);
    res.json(item);
  } catch (e: any) {
    if (e.message === "Forbidden") return res.status(403).json({ message: e.message });
    if (e.message === "Item not found") return res.status(404).json({ message: e.message });
    throw e;
  }
});

export const deleteItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    await itemsService.delete(req.params.id as string, req.userId!);
    res.json({ message: "Item deleted" });
  } catch (e: any) {
    if (e.message === "Forbidden") return res.status(403).json({ message: e.message });
    if (e.message.includes("active rentals") || e.message === "Item not found")
      return res.status(400).json({ message: e.message });
    throw e;
  }
});