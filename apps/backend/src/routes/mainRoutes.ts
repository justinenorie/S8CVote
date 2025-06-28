// TODO: Setup the main routes here (main index)
import express from "express";
import authRoutes from "./api/auth";
import adminRoutes from "./api/admin";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

export default router;
