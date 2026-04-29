import Generation from "../../models/Generation.js";
import { uploadToS3 } from "../../utils/s3Upload.js";
import { detectFileType } from "../../middleware/imageValidator.js";
import { sendToAI } from "../../utils/Aiservice.js";

// POST /api/generations
export const createGeneration = async (req, res) => {
  try {
    const { prompt = "", category = "" } = req.body;

    if (!prompt.trim() && !req.files?.length) {
      return res.status(400).json({ success: false, message: "Provide a prompt or at least one file." });
    }

    const attachedFiles = await Promise.all(
      (req.files ?? []).map(async (f) => {
        const fileType = detectFileType(f);
        const s3Url   = await uploadToS3(f.buffer, f.originalname, f.mimetype, `${fileType}s`);
        return { originalName: f.originalname, mimeType: f.mimetype, fileType, s3Url, sizeBytes: f.size };
      })
    );

    const generation = await Generation.create({
      prompt:   prompt.trim(),
      category: category.trim(),
      attachedFiles,
      userId:   req.user?._id ?? null,
    });

    // Call AI and save output
    const result = await sendToAI(generation);
    generation.output = result.outputText;
    await generation.save();

    return res.status(201).json({ success: true, generation });
  } catch (err) {
    console.error("[createGeneration]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/generations
export const listGenerations = async (req, res) => {
  try {
    const generations = await Generation.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, generations });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/generations/:id
export const getGeneration = async (req, res) => {
  try {
    const generation = await Generation.findById(req.params.id);
    if (!generation) return res.status(404).json({ success: false, message: "Not found." });
    return res.json({ success: true, generation });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};