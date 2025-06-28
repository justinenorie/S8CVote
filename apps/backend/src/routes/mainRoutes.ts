// TODO: Setup the main routes here (main index)
import express from "express";
import authRoutes from "./api/auth";

const router = express.Router();

router.use("/auth", authRoutes);
// TODO: Admin control routes here

export default router;
