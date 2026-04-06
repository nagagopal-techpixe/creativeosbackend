import express from "express";
import {
  getNav,
  updateNavItem,
  toggleNavItem,
} from "../controllers/navConfig/navController.js";

const router = express.Router();

router.get("/",                    getNav);         // GET  /api/nav
router.patch("/item/:id",          updateNavItem);  // PATCH /api/nav/item/videos
router.patch("/item/:id/toggle",   toggleNavItem);  // PATCH /api/nav/item/videos/toggle

export default router;