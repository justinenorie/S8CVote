// TODO: Setup the main routes here (main index)
import express from "express";
import authRoutes from "./api/auth";

const router = express.Router();

router.use("/auth", authRoutes);

export default router;
