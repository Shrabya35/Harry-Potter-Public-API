import { Router } from "express";
import {
  getSpell,
  getSpellById,
  getSpellTypeById,
  getSpellTypes,
} from "../controllers/spell.controller";

const router = Router();

router.get("/", getSpell);

router.get("/types", getSpellTypes);
router.get("/types/:id", getSpellTypeById);

router.get("/:id", getSpellById);

export default router;
