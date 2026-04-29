import { Router } from "express";
import { fileFilter  } from "../middleware/imageValidator.js";
import { createGeneration, listGenerations, getGeneration } from "../controllers/Generations/Generationcontroller.js";
import { protectUser } from "../middleware/authMiddleware.js";
import multer from "multer";
const router = Router();

const generationUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 },
}).array("files", 10);

router.post("/",   protectUser, generationUpload, createGeneration);  // save prompt + files
router.get("/",  protectUser,   listGenerations);                  // list all
router.get("/:id", protectUser, getGeneration);                    // single

export default router;