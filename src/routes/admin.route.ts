import { Router } from "express";
import {
  adminLoginController,
  createAdminController,
  getUserDetail,
  getUsers,
} from "../controllers/admin.controller";
import {
  createSpell,
  createSpellType,
  deleteSpell,
  deleteSpellType,
  editSpell,
  editSpellType,
  getSpell,
  getSpellById,
  getSpellTypeById,
  getSpellTypes,
} from "../controllers/spell.controller";
import { adminAuthMiddleware } from "../middleware/adminMiddleware";

const router = Router();

router.post("/create", createAdminController);
router.post("/login", adminLoginController);
router.get("/get-users", adminAuthMiddleware, getUsers);
router.get("/get-user/:id", adminAuthMiddleware, getUserDetail);
router.get("/spell-type/", adminAuthMiddleware, getSpellTypes);
router.post("/spell-type/create", adminAuthMiddleware, createSpellType);
router.post("/spell-type/edit/:id", adminAuthMiddleware, editSpellType);
router.delete("/spell-type/delete/:id", adminAuthMiddleware, deleteSpellType);
router.get("/spell-type/:id", adminAuthMiddleware, getSpellTypeById);
router.get("/spell/", adminAuthMiddleware, getSpell);
router.post("/spell/create", adminAuthMiddleware, createSpell);
router.post("/spell/edit/:id", adminAuthMiddleware, editSpell);
router.delete("/spell/delete/:id", adminAuthMiddleware, deleteSpell);
router.get("/spell/:id", adminAuthMiddleware, getSpellById);

export default router;
