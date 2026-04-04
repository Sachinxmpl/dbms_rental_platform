import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { usersService } from "./users.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await usersService.getProfile(req.userId!);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export const updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await usersService.updateProfile(req.userId!, req.body);
  res.json(user);
});

export const submitVerification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { governmentIdUrl } = req.body;
  if (!governmentIdUrl) return res.status(400).json({ message: "governmentIdUrl is required" });
  const result = await usersService.submitVerification(req.userId!, governmentIdUrl);
  res.json({ message: "Verification submitted, under review", ...result });
});

export const getUserPublicProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const profile = await usersService.getUserPublicProfile(req.params.id as string);
  if (!profile) return res.status(404).json({ message: "User not found" });
  res.json(profile);
});