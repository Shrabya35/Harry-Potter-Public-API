import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { PLAN_LIMITS } from "../constants/planLimit";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const apiKeyAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key missing",
    });
  }

  const user = await prisma.user.findUnique({
    where: { apiKey },
  });

  if (!user) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key",
    });
  }

  req.user = user;

  next();
};

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const limit = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS];

  if (limit === null) {
    return next();
  }

  const startOfDay = new Date();

  const usageCount = await prisma.usage.count({
    where: {
      userId: user.id,
      timestamp: {
        gte: startOfDay,
      },
    },
  });

  if (usageCount >= limit) {
    return res.status(429).json({
      success: false,
      message: "Daily API limit exceeded",
    });
  }

  await prisma.usage.create({
    data: {
      userId: user.id,
      endpoint: req.originalUrl,
    },
  });

  next();
};
