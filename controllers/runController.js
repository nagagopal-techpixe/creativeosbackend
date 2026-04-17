
import { uploadToS3 } from "../utils/s3Upload.js";
import RunData        from "../models/runData.js";

export const runModel = async (req, res) => {

    console.log("req.body", req.body);
    try {
        const model      = req.model;           // attached by fetchModel middleware
        const attributes = model.model_attributes ?? [];
        const inputs     = {};
        console.log("model",model)
        console.log("attributes",attributes)
        console.log("inputs",inputs)


        // ── Step 1: Handle file fields (image / video) ──────────────────
        if (req.files) {
            for (const attr of attributes) {
                if (attr.dtype !== "image" && attr.dtype !== "video") continue;

                const filesForField = req.files[attr.name];
                if (!filesForField || filesForField.length === 0) continue;

                const folder = attr.dtype === "image" ? "images" : "videos";

                // Upload all files for this field to S3
                const urls = await Promise.all(
                    filesForField.map((file) =>
                        uploadToS3(file.buffer, file.originalname, file.mimetype, folder)
                    )
                );

                // Single file → store as string; multiple → store as array
                inputs[attr.name] = urls.length === 1 ? urls[0] : urls;
            }
        }


const parsedInput = req.body.input ? JSON.parse(req.body.input) : {};

for (const attr of attributes) {
    if (attr.dtype === "image" || attr.dtype === "video") continue;

    const value = parsedInput[attr.name];
    if (value !== undefined && value !== "") {
        inputs[attr.name] = value;
    }
}
        // ── Step 3: Save to DB ───────────────────────────────────────────
        const runData = await RunData.create({
            model:  model._id,
            inputs,
              userId:    req.user?._id,      
  projectId: req.body.projectId,
        });

        const populated = await runData.populate("model", "model_name category");

        return res.status(201).json({
            success:    true,
            message:    "Data saved successfully",
            data:       populated,
            statuscode: 201,
        });

    } catch (error) {
        return res.status(500).json({
            success:    false,
            message:    "Internal server error",
            error:      error.message,
            statuscode: 500,
        });
    }
};