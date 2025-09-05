import express from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
  addCandidate,
  getCandidates,
  deleteCandidate,
  addStudent,
} from "../../controllers/adminController";
import { verifyAdmin } from "../../middlewares/verifyMiddleware";

const router = express.Router();

// Admin Control routes belong here
// CATEGORY routes
router.post("/category", verifyAdmin, createCategory);
router.get("/category", verifyAdmin, getCategories);
router.delete("/category/:id", verifyAdmin, deleteCategory);

// CANDIDATE routes
router.post("/candidate", verifyAdmin, addCandidate);
router.get("/candidate", verifyAdmin, getCandidates);
router.delete("/candidate/:id", verifyAdmin, deleteCandidate);

// STUDENT route
router.post("/student", verifyAdmin, addStudent);

export default router;
