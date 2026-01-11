import { Router } from "express";
import { getHouse } from "../controllers/house.Controller";

const router = Router();

router.get("/", getHouse);

export default router;
