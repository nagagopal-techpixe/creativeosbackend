import express from "express";
import { uploadLoader } from "../controllers/LoaderController.js";
import { protectUser } from "../middleware/authMiddleware.js";
import { loaderUpload } from "../middleware/imageValidator.js";
import multer from "multer";
const router = express.Router();

// ─── Middleware to handle multer errors gracefully ───────────────────────────

const handleLoaderUpload = (req, res, next) => {
  loaderUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message })
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message })
    }
    next()
  })
}

// POST /api/loader/upload  →  field name must be "file"
router.post("/upload", protectUser, handleLoaderUpload, uploadLoader);

export default router;