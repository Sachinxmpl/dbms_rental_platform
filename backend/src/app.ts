import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import itemsRoutes from "./modules/items/items.routes";
import rentalsRoutes from "./modules/rentals/rentals.routes";
import rentalReviewRoutes from "./modules/reviews/reviews.routes";
import uploadRoutes from "./modules/uploads/uploads.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve uploaded files as static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/rentals", rentalsRoutes);
app.use("/api/rentals", rentalReviewRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(errorHandler);

if (env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => console.log(`Sajilorent running on port ${env.PORT}`));
}

export default app;