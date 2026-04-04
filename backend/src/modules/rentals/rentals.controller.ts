import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { rentalsService } from "./rentals.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const createRental = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const rental = await rentalsService.create(req.userId!, req.body);
    res.status(201).json(rental);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

export const updateRentalStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const rental = await rentalsService.updateStatus(req.params.id as string, req.userId!, req.body.action, req.body);
    res.json(rental);
  } catch (e: any) {
    const status = e.message === "Forbidden" ? 403 : e.message === "Rental not found" ? 404 : 400;
    res.status(status).json({ message: e.message });
  }
});

export const getMyRentals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const role = (req.query.role as "renter" | "owner") ?? "renter";
  const rentals = await rentalsService.getMyRentals(req.userId!, role);
  res.json(rentals);
});

export const getRentalById = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const rental = await rentalsService.getById(req.params.id as string, req.userId!);
    res.json(rental);
  } catch (e: any) {
    const status = e.message === "Forbidden" ? 403 : 404;
    res.status(status).json({ message: e.message });
  }
});