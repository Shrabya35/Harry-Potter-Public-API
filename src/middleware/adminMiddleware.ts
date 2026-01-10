import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import jwt from "jsonwebtoken";

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing or malformed",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Admin not found.",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
