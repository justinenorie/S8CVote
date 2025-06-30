import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtHandler";

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("Missing Authorization header");
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyAccessToken(token) as any;
    if (decoded.role !== "admin") {
      console.log("Forbidden: Not admin");
      return res.sendStatus(403);
    }

    (req as any).adminId = decoded.id;
    next();
  } catch (err) {
    console.log("Invalid token", err);
    res.sendStatus(403);
  }
};

// TODO: Add the verify accessToken for students to vote.
export const verifyStudent = async () => {};
