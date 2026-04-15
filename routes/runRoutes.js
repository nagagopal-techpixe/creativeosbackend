import express from "express";
import { fetchModel }        from "../middleware/fetchModel.js";
import { handleImageUpload } from "../middleware/imageValidator.js";
import { runModel }          from "../controllers/runController.js";
import { protectUser }      from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/run/:modelId
router.post("/:modelId", protectUser, fetchModel, handleImageUpload, runModel);

export default router;