import { Request, Response } from "express";
import { adminLogin, createAdmin } from "../services/admin.service";
import { validateRequiredFields } from "../utils/validateRequiredField";
import { prisma } from "../config/db";

export const createAdminController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    validateRequiredFields({ email, password }, res);

    const admin = await createAdmin({ email, password });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create admin",
    });
  }
};

export const adminLoginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    validateRequiredFields({ email, password }, res);
    const { admin, token } = await adminLogin(email, password);

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      data: {
        id: admin.id,
        email: admin.email,
      },
      token,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "error in admin login",
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = req.query.page
      ? Math.max(parseInt(req.query.page as string), 1)
      : null;
    const limit = req.query.limit
      ? Math.min(Math.max(parseInt(req.query.limit as string), 1), 50)
      : null;

    const shouldPaginate = page !== null || limit !== null;

    const skip =
      shouldPaginate && page && limit ? (page - 1) * limit : undefined;
    const take = shouldPaginate ? limit ?? 10 : undefined;

    const [users, total] = await Promise.all([
      await prisma.user.findMany({
        ...(shouldPaginate && { skip, take }),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              usage: true,
            },
          },
        },
      }),
      await prisma.user.count(),
    ]);
    return res.status(200).json({
      success: true,
      data: users,
      ...(shouldPaginate && {
        meta: {
          page: page ?? 1,
          limit: take,
          total,
          totalPages: Math.ceil(total / (take || total)),
        },
      }),
    });
  } catch (error: any) {
    console.error("getUsers error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

export const getUserDetail = async (req: Request, res: Response) => {
  try {
    const page = req.query.page
      ? Math.max(parseInt(req.query.page as string), 1)
      : null;

    const limit = req.query.limit
      ? Math.min(Math.max(parseInt(req.query.limit as string), 1), 50)
      : null;

    const shouldPaginate = page !== null || limit !== null;

    const skip =
      shouldPaginate && page && limit ? (page - 1) * limit : undefined;

    const take = shouldPaginate ? limit ?? 10 : undefined;

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        usage: {
          ...(shouldPaginate && { skip, take }),
          orderBy: {
            timestamp: "desc",
          },
        },
        _count: {
          select: {
            usage: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const totalUsage = user._count.usage;

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        ...user,
        usageCount: totalUsage,
        _count: undefined,
      },
      ...(shouldPaginate && {
        meta: {
          page: page ?? 1,
          limit: take,
          total: totalUsage,
          totalPages: Math.ceil(totalUsage / (take || totalUsage)),
        },
      }),
    });
  } catch (error: any) {
    console.log("GetUserDetail error :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve user",
    });
  }
};
