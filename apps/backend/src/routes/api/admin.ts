import express from "express";
import {
  createCategory,
  deleteCategory,
  addCandidate,
  deleteCandidate,
  addStudent,
} from "../../controllers/adminController";
import { verifyAdmin } from "../../middlewares/verifyMiddleware";

const router = express.Router();

// Admin Control routes belong here
// CATEGORY routes
router.post("/category", verifyAdmin, createCategory);
router.delete("/category/:id", verifyAdmin, deleteCategory);

// CANDIDATE routes
router.post("/candidate", verifyAdmin, addCandidate);
router.delete("/candidate/:id", verifyAdmin, deleteCandidate);

// STUDENT route
router.post("/student", verifyAdmin, addStudent);

export default router;
