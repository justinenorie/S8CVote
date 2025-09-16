import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/database";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtHandler";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
  errors?: string[];
};

// ADMIN REGISTER
// TODO: must have a confirmation with the other admin before succeeding with the registration
export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { adminUser, fullname, password } = req.body;

  const existing = await prisma.admin.findUnique({ where: { adminUser } });

  if (existing) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Registration failed",
      errors: ["Admin already exists"],
    };

    return res.status(409).json(response);
  }

  const hashed = await bcrypt.hash(password, 10);

  const newAdmin = await prisma.admin.create({
    data: { adminUser, fullname, password: hashed },
  });

  const response: ApiResponse<{ adminID: string }> = {
    success: true,
    message: "Admin registered",
    data: { adminID: newAdmin.id },
  };

  res.status(201).json(response);
};

// ADMIN LOGIN
// TODO: Use the accessToken for the frontend to do something such as add vote or delete something
export const loginAdmin = async (req: Request, res: Response): Promise<any> => {
  const { adminUser, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { adminUser } });
  if (!admin) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Login Failed: Credential not exist",
      errors: ["Admin not found"],
    };

    return res.status(404).json(response);
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Login Failed: Incorrect Password",
      errors: ["Invalid credentials"],
    };

    return res.status(401).json(response);
  }

  const payload = { id: admin.id, role: "admin" };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.admin.update({
    where: { id: admin.id },
    data: { token: refreshToken },
  });

  const response: ApiResponse<{ token: string }> = {
    success: true,
    message: "Login successful",
    token: accessToken,
  };

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(response);
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
    .json({
      success: true,
      token: accessToken,
      message: "Login successful",
    });
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

// Refresh Access Token
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = verifyRefreshToken(token) as {
      id: string;
      role: "admin" | "student";
    };

    let user;
    if (decoded.role === "admin") {
      user = await prisma.admin.findUnique({ where: { id: decoded.id } });
    } else if (decoded.role === "student") {
      user = await prisma.student.findUnique({ where: { id: decoded.id } });
    }

    if (!user || user.token !== token) {
      return res.sendStatus(403); // Refresh token is invalid or doesn't match DB
    }

    const accessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });
    return res.status(200).json({
      success: true,
      token: accessToken,
      message: "Login successful",
    });
  } catch (err) {
    return res.sendStatus(403); // Invalid refresh token
  }
};
