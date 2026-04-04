import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { reviewsService } from "./reviews.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const review = await reviewsService.create(req.params.rentalId as string, req.userId!, req.body);
    res.status(201).json(review);
  } catch (e: any) {
    const status = e.message === "Forbidden" ? 403 : 400;
    res.status(status).json({ message: e.message });
  }
});