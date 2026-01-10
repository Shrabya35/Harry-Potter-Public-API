import { Request, Response } from "express";
import { adminLogin, createAdmin } from "../services/admin.service";
import { validateRequiredFields } from "../utils/validateRequiredField";

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
