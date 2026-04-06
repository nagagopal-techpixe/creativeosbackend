// routes/userRoutes.js
import express from "express";
import { getUserVideoBuilder } from "../controllers/userBuilderController.js";
import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/video-builder", protectUser, getUserVideoBuilder);  // 👈 user's filtered view

export default router;