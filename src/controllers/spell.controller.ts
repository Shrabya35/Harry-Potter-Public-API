import { prisma } from "../config/db";
import { Request, Response, NextFunction } from "express";
import { validateRequiredFields } from "../utils/validateRequiredField";

export const createSpellType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    validateRequiredFields({ name, description }, res);

    const existingSpellType = await prisma.spellType.findUnique({
      where: { name },
    });

    if (existingSpellType) {
      return res.status(400).json({
        success: true,
        message: "Spell Type with this name already exist",
      });
    }

    const spellType = await prisma.spellType.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Spell Type created successfully",
      data: spellType,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "error in createing soell type",
    });
  }
};

export const getSpellTypes = async (req: Request, res: Response) => {
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

    const [spellTypes, total] = await Promise.all([
      prisma.spellType.findMany({
        ...(shouldPaginate && { skip, take }),
        orderBy: { createdAt: "desc" },
      }),
      prisma.spellType.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: spellTypes,
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
    console.error("getSpellTypes error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch spell types",
    });
  }
};

export const editSpellType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Spell Type ID is required",
      });
    }

    if (
      !validateRequiredFields({ name, description }, res, {
        edit: true,
      })
    ) {
      return;
    }

    const existingSpellType = await prisma.spellType.findUnique({
      where: { id },
    });

    if (!existingSpellType) {
      return res.status(404).json({
        success: false,
        message: "Spell type not found",
      });
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined && name !== existingSpellType.name) {
      updateData.name = name;
    }
    if (description) updateData.description = description;
    const spellType = await prisma.spellType.update({
      where: { id },
      data: updateData,
    });
    return res.status(200).json({
      success: true,
      message: "Spell type edited successfully",
      data: spellType,
    });
  } catch (error: any) {
    console.error("editSpellType error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to edit spell type",
    });
  }
};

export const deleteSpellType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "SpellType ID is required",
      });
    }

    const spellType = await prisma.spellType.findUnique({
      where: { id },
    });

    if (!spellType) {
      return res.status(200).json({
        success: false,
        message: "Spell type not found",
      });
    }

    await prisma.spellType.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: "Spell type deleted successfully",
      id,
    });
  } catch (error: any) {
    console.error("deleteSpellType error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete spell type",
    });
  }
};

export const getSpellTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "SpellType ID is required",
      });
    }

    const spellType = await prisma.spellType.findUnique({
      where: { id },
    });

    if (!spellType) {
      return res.status(200).json({
        success: false,
        message: "Spell not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched spell Type successfully",
      data: spellType,
    });
  } catch (error: any) {
    console.log("GetSpellTypeById error :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error in fetching spell Type",
    });
  }
};

export const createSpell = async (req: Request, res: Response) => {
  try {
    const { name, description, typeId } = req.body;
    validateRequiredFields({ name, description, typeId }, res);

    const existingSpell = await prisma.spell.findUnique({
      where: { name },
    });

    if (existingSpell) {
      return res.status(400).json({
        success: true,
        message: "Spell with this name already exist",
      });
    }

    const spell = await prisma.spell.create({
      data: {
        name,
        description,
        typeId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Spell created successfully",
      data: spell,
    });
  } catch (error: any) {
    console.error("createSpell error:", error);
    return res.status(201).json({
      success: true,
      message: error.message || "failed to create spell",
    });
  }
};

export const getSpell = async (req: Request, res: Response) => {
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

    const [spells, total] = await Promise.all([
      prisma.spell.findMany({
        ...(shouldPaginate && { skip, take }),
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.spell.count(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Spell fetched successfully",
      data: spells,
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
    console.log("getSpell error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch spells",
    });
  }
};

export const editSpell = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, typeId } = req.body || {};

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Spell ID is required",
      });
    }

    if (
      !validateRequiredFields({ name, description, typeId }, res, {
        edit: true,
      })
    ) {
      return;
    }

    const existingSpell = await prisma.spell.findUnique({
      where: { id },
    });

    if (!existingSpell) {
      return res.status(404).json({
        success: false,
        message: "Spell not found",
      });
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined && name !== existingSpell.name) {
      updateData.name = name;
    }
    if (description !== undefined) updateData.description = description;
    if (typeId !== undefined) updateData.typeId = typeId;

    console.log(existingSpell);
    console.log(updateData);
    const spell = await prisma.spell.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Spell type edited successfully",
      data: spell,
    });
  } catch (error: any) {
    console.log("EditSpell error: ", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to edit spell",
    });
  }
};

export const deleteSpell = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Spell ID is required",
      });
    }

    const spell = await prisma.spell.findUnique({
      where: { id },
    });

    if (!spell) {
      return res.status(200).json({
        success: false,
        message: "Spell not found",
      });
    }

    await prisma.spell.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: "Spell deleted successfully",
      id,
    });
  } catch (error: any) {
    console.log("DeleteSpell error :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete spell",
    });
  }
};

export const getSpellById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Spell ID is required",
      });
    }

    const spell = await prisma.spell.findUnique({
      where: { id },
      include: {
        type: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!spell) {
      return res.status(404).json({
        success: false,
        message: "Spell not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched spell successfully",
      data: spell,
    });
  } catch (error: any) {
    console.log("GetSpellById error :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error in fetching spell",
    });
  }
};
