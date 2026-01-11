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
import {
  createHouse,
  deleteHouse,
  editHouse,
  getHouse,
} from "../controllers/house.Controller";

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
router.get("/house", adminAuthMiddleware, getHouse);
router.post("/house/create", adminAuthMiddleware, createHouse);
router.post("/house/edit/:id", adminAuthMiddleware, editHouse);
router.delete("/house/delete/:id", adminAuthMiddleware, deleteHouse);

export default router;
