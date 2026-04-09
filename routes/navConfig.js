import express from "express";
import {
  getNav,
  updateNavItem,
  toggleNavItem,
  toggleNavSection,
} from "../controllers/navConfig/navController.js";

const router = express.Router();

router.get("/",                          getNav);           // GET  /api/nav
router.patch("/section/toggle",          toggleNavSection); // PATCH /api/nav/section/toggle
router.patch("/item/:itemId",            updateNavItem);    // PATCH /api/nav/item/:itemId  (MongoDB _id)
router.patch("/item/:itemId/toggle",     toggleNavItem);    // PATCH /api/nav/item/:itemId/toggle

export default router;