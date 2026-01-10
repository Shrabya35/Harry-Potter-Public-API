import { prisma } from "../config/db";
import crypto from "crypto";

interface CreateUserInput {
  name: string;
  email: string;
  plan: "FREE" | "PRO" | "PREMIUM";
}

export const creatUser = async (data: CreateUserInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const apiKey = crypto.randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      plan: data.plan,
      apiKey,
    },
  });

  return user;
};
