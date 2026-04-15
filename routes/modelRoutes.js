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

router.post("/",                    createModel);
router.get("/",                      getAllModels);
router.get("/:id",                       getModelById);
router.get("/category/:categoryId",      getModelsByCategory);
router.patch("/:id",                     updateModel);
router.delete("/:id",                 deleteModel);

export default router;