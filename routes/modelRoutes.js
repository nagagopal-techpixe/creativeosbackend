import express from "express";
import {
    createModel,
    getAllModels,
    getModelById,
    getModelsByCategory,
    updateModel,
    deleteModel      
} from "../controllers/modelcontroller.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",                        protectAdmin, createModel);
router.get("/",                         protectAdmin, getAllModels);
router.get("/:id",                      protectAdmin, getModelById);
router.get("/category/:categoryId",     protectAdmin, getModelsByCategory);
router.patch("/:id",                    protectAdmin, updateModel);
router.delete("/:id",                   protectAdmin, deleteModel);

export default router;