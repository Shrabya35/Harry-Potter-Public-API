import { Request, Response } from "express";
import { creatUser } from "../services/user.service";
import { validateRequiredFields } from "../utils/validateRequiredField";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, plan } = req.body;

    validateRequiredFields({ name, email, plan }, res);

    if (!["FREE", "PRO", "PREMIUM"].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan value",
        allowed: ["FREE", "PRO", "PREMIUM"],
      });
    }

    const user = await creatUser({ name, email, plan });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        apiKey: user.apiKey,
      },
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create user",
    });
  }
};
