import { Router } from "express";
import { createReview } from "./reviews.controller";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createReviewSchema } from "./reviews.schema";

const router = Router();

router.post("/:rentalId/reviews", authenticate, validate(createReviewSchema), createReview);

export default router;