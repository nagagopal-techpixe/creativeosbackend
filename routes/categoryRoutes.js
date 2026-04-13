import express from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryById
} from "../controllers/categories.js";
import { protectUser } from "../middleware/authMiddleware.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", protectAdmin,        createCategory);
router.get("/",      protectAdmin,   getAllCategories);
router.get("/:id",      protectAdmin,   getCategoryById);

export default router;