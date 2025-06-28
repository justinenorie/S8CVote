import { Request, Response } from "express";
import { generateAccessToken, verifyRefreshToken } from "../utils/jwtHandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const refreshAccessToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = verifyRefreshToken(token) as any;

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin || admin.refreshToken !== token) return res.sendStatus(403); // refresh token invalid

    const newAccessToken = generateAccessToken({
      id: admin.id,
      email: admin.email,
    });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.sendStatus(403);
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204); // no content

  try {
    const decoded = verifyRefreshToken(token) as any;

    // Invalidate token
    await prisma.admin.update({
      where: { id: decoded.id },
      data: { refreshToken: null },
    });

    res.clearCookie("refreshToken").sendStatus(200);
  } catch (err) {
    res.sendStatus(403);
  }
};
