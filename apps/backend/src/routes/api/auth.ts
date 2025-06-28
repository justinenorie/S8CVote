import express from "express";
import {
  registerAdmin,
  loginAdmin,
  loginStudent,
  logout,
} from "../../controllers/authController";

const router = express.Router();

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.post("/student/login", loginStudent);
router.post("/logout", logout);

export default router;
