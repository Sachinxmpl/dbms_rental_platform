import { Router } from "express";
import { createItem, listItems, getItem, updateItem, deleteItem } from "./items.controller";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createItemSchema, updateItemSchema } from "./items.schema";

const router = Router();

router.get("/", listItems);
router.get("/:id", getItem);
router.post("/", authenticate, validate(createItemSchema), createItem);
router.patch("/:id", authenticate, validate(updateItemSchema), updateItem);
router.delete("/:id", authenticate, deleteItem);

export default router;