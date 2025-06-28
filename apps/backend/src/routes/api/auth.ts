import express from "express";
import {
  registerAdmin,
  loginAdmin,
  loginStudent,
  logout,
} from "../../controllers/authController";

const router = express.Router();

// Authentication routes belongs here
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.post("/student/login", loginStudent);
router.post("/logout", logout);
// TODO: Need to add the refreshing Token Routes so the frontend can refresh the Token once it is expired or do something with it.

export default router;
