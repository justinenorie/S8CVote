import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtHandler";

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token) as any;

  if (decoded.role !== "admin") return res.sendStatus(403);

  // Attach admin ID to request for later use
  (req as any).adminId = decoded.id;
  next();
};
