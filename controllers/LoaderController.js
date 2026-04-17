import Loader from "../models/Loader.js";
import { uploadToS3 } from "../utils/s3Upload.js";
import { detectFileType } from "../middleware/imageValidator.js";

// ─── Size limits per type (bytes) ────────────────────────────────────────────

const SIZE_LIMITS = {
  image: 10  * 1024 * 1024,   // 10 MB
  video: 200 * 1024 * 1024,   // 200 MB
  audio: 50  * 1024 * 1024,   // 50 MB
}

// ─── S3 folder per type ──────────────────────────────────────────────────────

const S3_FOLDER = {
  image: "images",
  video: "videos",
  audio: "audios",
}

export const uploadLoader = async (req, res) => {
  try {
    const file = req.file

    // ── 1. File presence ───────────────────────────────────────────────────
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Send the file in the 'file' field.",
      })
    }

    // ── 2. Detect type ─────────────────────────────────────────────────────
    const type = detectFileType(file)
    if (!type) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid file type. Allowed — " +
          "Images: .jpg .png .webp | Videos: .mp4 .mov .webm | Audio: .mp3 .wav .ogg",
      })
    }

    // ── 3. Size validation ─────────────────────────────────────────────────
    if (file.size > SIZE_LIMITS[type]) {
      const limitMB = SIZE_LIMITS[type] / (1024 * 1024)
      return res.status(400).json({
        success: false,
        message: `File too large. Max size for ${type} is ${limitMB}MB. Got ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
      })
    }

    // ── 4. Upload to S3 ────────────────────────────────────────────────────
    const url = await uploadToS3(
      file.buffer,
      file.originalname,
      file.mimetype,
      S3_FOLDER[type]
    )

    if (!url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload file to storage.",
      })
    }

    // ── 5. Save to DB ──────────────────────────────────────────────────────
    const doc = await Loader.create({
      url,
      type,
      filename: file.originalname,
      mimetype: file.mimetype,
      size:     file.size,
      userId:   req.user?._id,
      projectId: req.body.projectId || null, 
    })

    return res.status(200).json({
      success: true,
      data: doc,
    })

  } catch (err) {
    console.error("uploadLoader error:", err)
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}