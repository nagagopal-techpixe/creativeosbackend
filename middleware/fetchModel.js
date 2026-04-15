import Models from "../models/models.js";

export const fetchModel = async (req, res, next) => {
    try {
        const { modelId } = req.params;

        const model = await Models.findById(modelId);
        if (!model) {
            return res.status(404).json({
                success:    false,
                message:    "Model not found",
                statuscode: 404
            });
        }

        req.model = model; // ← attach to req so imageValidator can use it
        next();

    } catch (error) {
        return res.status(500).json({
            success:    false,
            message:    "Internal server error",
            error:      error.message,
            statuscode: 500
        });
    }
};