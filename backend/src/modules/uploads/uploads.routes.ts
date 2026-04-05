import { Router, Request, Response } from "express";
import { authenticate } from "../../middleware/auth";
import { uploadImages } from "../../middleware/upload";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post(
  "/images",
  authenticate,
  (req: Request, res: Response, next: Function) => {
    uploadImages(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0)
      return res.status(400).json({ message: "No images uploaded" });

    const urls = files.map((f) => `/uploads/${f.filename}`);
    res.json({ urls });
  })
);

export default router;