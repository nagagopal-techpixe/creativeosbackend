// routes/imageLoaderRoutes.js

import express from "express";
import { uploadImage } from "../controllers/LoaderController.js";
import { protectUser } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// simple multer (only image loader)
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload-image",
  protectUser,
  upload.fields([{ name: "image", maxCount: 1 }]),
  uploadImage
);

export default router;