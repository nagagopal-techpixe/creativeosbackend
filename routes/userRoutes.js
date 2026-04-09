// routes/userRoutes.js
import express from "express";
import { getmodulepermissions } from "../controllers/user/modules_data.js";
import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/video-builder", protectUser, getmodulepermissions);  

export default router;