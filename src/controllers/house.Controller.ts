import { Request, Response } from "express";
import { prisma } from "../config/db";
import { validateRequiredFields } from "../utils/validateRequiredField";

export const createHouse = async (req: Request, res: Response) => {
  try {
    const { name, logo, creator } = req.body;
    validateRequiredFields({ name, logo, creator }, res);

    const existingHouse = await prisma.house.findUnique({
      where: { name },
    });

    if (existingHouse) {
      return res.status(400).json({
        success: true,
        message: "House with this name already exist",
      });
    }

    const house = await prisma.house.create({
      data: {
        name,
        logo,
        creator,
      },
    });

    return res.status(200).json({
      success: true,
      message: "House created successfully",
      data: house,
    });
  } catch (error: any) {
    console.log("CreateHouse error :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create house",
    });
  }
};

export const getHouse = async (req: Request, res: Response) => {
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

    const [house, total] = await Promise.all([
      prisma.house.findMany({
        ...(shouldPaginate && { skip, take }),
        orderBy: { createdAt: "desc" },
      }),
      prisma.house.count(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Successfully fetched House",
      data: house,
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
    console.error("getHouse error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch house",
    });
  }
};

export const editHouse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, logo, creator } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "House ID is required",
      });
    }

    if (
      !validateRequiredFields({ name, logo, creator }, res, {
        edit: true,
      })
    ) {
      return;
    }

    const existingHouse = await prisma.house.findUnique({
      where: { id },
    });

    if (!existingHouse) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined && name !== existingHouse.name) {
      updateData.name = name;
    }
    if (logo) updateData.logo = logo;
    if (creator) updateData.creator = creator;

    const house = await prisma.house.update({
      where: { id },
      data: updateData,
    });
    return res.status(200).json({
      success: true,
      message: "House edited successfully",
      data: house,
    });
  } catch (error: any) {
    console.error("editHouse error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to edit house",
    });
  }
};

export const deleteHouse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "House ID is required",
      });
    }

    const house = await prisma.house.findUnique({
      where: { id },
    });

    if (!house) {
      return res.status(200).json({
        success: false,
        message: "House not found",
      });
    }

    await prisma.house.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: "House deleted successfully",
      id,
    });
  } catch (error: any) {
    console.error("deleteHouse error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete House",
    });
  }
};
