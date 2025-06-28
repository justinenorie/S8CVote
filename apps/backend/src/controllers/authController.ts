import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/database";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtHandler";

// ADMIN REGISTER
// TODO: not ideal this will change in the future
export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { adminUser, fullname, password } = req.body;

  const existing = await prisma.admin.findUnique({ where: { adminUser } });
  if (existing) return res.status(409).json({ error: "Admin already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const newAdmin = await prisma.admin.create({
    data: { adminUser, fullname, password: hashed },
  });

  res.status(201).json({ message: "Admin registered", adminID: newAdmin.id });
};

// ADMIN LOGIN
// TODO: Use the accessToken for the frontend to do something such as add vote or delete something
export const loginAdmin = async (req: Request, res: Response): Promise<any> => {
  const { adminUser, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { adminUser } });
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

  const payload = { id: admin.id, role: "admin" };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.admin.update({
    where: { id: admin.id },
    data: { token: refreshToken },
  });

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ accessToken });
};

// STUDENT LOGIN (Auto-register + vote check placeholder)
export const loginStudent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { studentID, fullname } = req.body;

  let student = await prisma.student.findUnique({ where: { studentID } });

  if (!student) {
    student = await prisma.student.create({
      data: {
        studentID,
        fullname,
        categoryIDVoted: null,
        candidatesIDVoted: null,
      },
    });
  }

  const payload = { id: student.id, role: "student" };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.student.update({
    where: { id: student.id },
    data: { token: refreshToken },
  });

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ accessToken });
};

// LOGOUT (for both admin & student)
export const logout = async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const decoded = verifyRefreshToken(token) as any;

    if (decoded.role === "admin") {
      await prisma.admin.update({
        where: { id: decoded.id },
        data: { token: null },
      });
    } else if (decoded.role === "student") {
      await prisma.student.update({
        where: { id: decoded.id },
        data: { token: null },
      });
    }

    res.clearCookie("refreshToken").sendStatus(200);
  } catch {
    res.sendStatus(403);
  }
};
