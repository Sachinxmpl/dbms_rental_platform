import { Router } from "express";
import { createRental, updateRentalStatus, getMyRentals, getRentalById } from "./rentals.controller";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createRentalSchema, updateRentalStatusSchema } from "./rentals.schema";

const router = Router();

router.use(authenticate);

router.post("/", validate(createRentalSchema), createRental);
router.get("/", getMyRentals);
router.get("/:id", getRentalById);
router.patch("/:id/status", validate(updateRentalStatusSchema), updateRentalStatus);

export default router;