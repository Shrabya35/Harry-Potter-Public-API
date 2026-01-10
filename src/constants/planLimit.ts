import { Plan } from "@prisma/client";

export const PLAN_LIMITS: Record<Plan, number | null> = {
  FREE: 100,
  PRO: 5000,
  PREMIUM: null,
};
