import { Router } from "express";
import { createUserController } from "../controllers/user.controller";

const router = Router();

router.post("/create", createUserController);

export default router;
