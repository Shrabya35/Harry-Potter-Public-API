import { prisma } from "../config/db";
import { Router } from "express";

export const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/db-test", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});
