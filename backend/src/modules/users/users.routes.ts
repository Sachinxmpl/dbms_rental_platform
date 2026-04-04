import { Router } from "express";
import { getMe, updateMe, submitVerification, getUserPublicProfile } from "./users.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateMe);
router.post("/me/verify", authenticate, submitVerification);
router.get("/:id", authenticate, getUserPublicProfile);

export default router;