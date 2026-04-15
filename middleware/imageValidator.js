import path from "path";
import multer from "multer";

// ─── Constants ─────────────

const ALLOWED_IMAGE_MIMES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_IMAGE_EXTS  = [".jpg", ".jpeg", ".png"];

const ALLOWED_VIDEO_MIMES = ["video/mp4"];
const ALLOWED_VIDEO_EXTS  = [".mp4"];

// ─── Storage ───────────────

const storage = multer.memoryStorage();

// ─── File Filter ───────────

const fileFilter = (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    // Check image
    if (ALLOWED_IMAGE_EXTS.includes(ext) && ALLOWED_IMAGE_MIMES.includes(mime)) {
        return cb(null, true); //  valid image
    }

    // Check video
    if (ALLOWED_VIDEO_EXTS.includes(ext) && ALLOWED_VIDEO_MIMES.includes(mime)) {
        return cb(null, true); //  valid video
    }

    //  reject anything else
    cb(
        new Error(
            `Invalid file type "${ext}". Images: ${ALLOWED_IMAGE_EXTS.join(", ")} | Videos: ${ALLOWED_VIDEO_EXTS.join(", ")}`
        ),
        false
    );
};

// ─── Dynamic Upload Handler 

export const handleImageUpload = (req, res, next) => {
    const attributes = req.model.model_attributes ?? [];

    const imageFields = attributes.filter((attr) => attr.dtype === "image");
    const videoFields = attributes.filter((attr) => attr.dtype === "video");
    const audioFields = attributes.filter((attr) => attr.dtype === "audio");

    // ✅ Always run multer to parse req.body (text fields)
    // Just skip file fields if there are none
    const fields = [
        ...imageFields.map((attr) => ({ name: attr.name, maxCount: 10 })),
        ...videoFields.map((attr) => ({ name: attr.name, maxCount: 10 })),
        ...audioFields.map((attr) => ({ name: attr.name, maxCount: 10 })),
    ]

    // Use .any() for text-only models, .fields() when file fields exist
    const upload = fields.length === 0
        ? multer({ storage }).none()          // ✅ parses body, no files expected
        : multer({ storage, fileFilter }).fields(fields)

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success:    false,
                message:    multerErrorMessage(err),
                statuscode: 400,
            })
        }
        if (err) {
            return res.status(400).json({
                success:    false,
                message:    err.message,
                statuscode: 400,
            })
        }
        next()
    })
}
// ─── Multer Error Messages ─

const multerErrorMessage = (err) => {
    switch (err.code) {
        case "LIMIT_FILE_COUNT":
            return `Too many files for field "${err.field}"`;
        case "LIMIT_UNEXPECTED_FILE":
            return `Unexpected field "${err.field}"`;
        default:
            return `Upload error: ${err.message}`;
    }
};