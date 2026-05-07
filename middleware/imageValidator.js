import path from "path";
import multer from "multer";

// ─── Allowed types ──────────────────

const ALLOWED = {
  image: {
    mimes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    exts:  [".jpg", ".jpeg", ".png", ".webp"],
    maxSizeMB: 10,
  },
  video: {
    mimes: ["video/mp4", "video/mov", "video/quicktime", "video/webm"],
    exts:  [".mp4", ".mov", ".webm"],
    maxSizeMB: 200,
  },
  audio: {
    mimes: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/x-wav"],
    exts:  [".mp3", ".wav", ".ogg"],
    maxSizeMB: 50,
  },
}

// ─── Detect type from file ──────────

export const detectFileType = (file) => {
  const ext  = path.extname(file.originalname).toLowerCase()
  const mime = file.mimetype.toLowerCase()

  for (const [type, config] of Object.entries(ALLOWED)) {
    if (config.exts.includes(ext) && config.mimes.includes(mime)) {
      return type
    }
  }
  return null
}

// ─── File filter ────────────────────

export const fileFilter = (req, file, cb) => {
  const type = detectFileType(file)
  if (!type) {
    return cb(
      new Error(
        `Invalid file type "${path.extname(file.originalname)}". ` +
        `Allowed — Images: .jpg .png .webp | Videos: .mp4 .mov .webm | Audio: .mp3 .wav .ogg`
      ),
      false
    )
  }
  cb(null, true)
}

// ─── Single loader upload (for /upload-loader route) ────────────────────────

export const loaderUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB hard cap (video is largest)
}).single("file")

// ─── Dynamic upload for model runner 

export const handleImageUpload = (req, res, next) => {
  const attributes = req.model?.model_attributes ?? []

  const fields = ["image", "video", "audio"].flatMap((dtype) =>
    attributes
      .filter((attr) => attr.dtype === dtype)
      .map((attr) => ({ name: attr.name, maxCount: 10 }))
  )

  const upload = fields.length === 0
    ? multer({ storage: multer.memoryStorage() }).none()
    : multer({ storage: multer.memoryStorage(), fileFilter }).fields(fields)

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: multerErrorMessage(err) })
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message })
    }
    next()
  })
}

// ─── Multer error messages ───────────

const multerErrorMessage = (err) => {
  switch (err.code) {
    case "LIMIT_FILE_SIZE":    return `File too large. Max size exceeded.`
    case "LIMIT_FILE_COUNT":   return `Too many files for field "${err.field}"`
    case "LIMIT_UNEXPECTED_FILE": return `Unexpected field "${err.field}"`
    default: return `Upload error: ${err.message}`
  }
}