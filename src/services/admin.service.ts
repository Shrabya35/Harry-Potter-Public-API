import { prisma } from "../config/db";
import { comparePassword, hashPassword } from "../helper/authHelper";
import jwt from "jsonwebtoken";

interface CreateAdminInput {
  email: string;
  password: string;
}

export const createAdmin = async (data: CreateAdminInput) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: data.email },
  });

  if (existingAdmin) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const admin = await prisma.admin.create({
    data: {
      email: data.email,
      password: hashedPassword,
    },
  });

  return admin;
};

export const adminLogin = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });
  if (!admin) {
    throw new Error("Invalid email");
  }

  const isPasswordValid = await comparePassword(password, admin.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(
    {
      id: admin.id,
      role: "admin",
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  return {
    admin,
    token,
  };
};
