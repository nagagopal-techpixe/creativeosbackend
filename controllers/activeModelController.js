import ActiveModel from "../models/activeModel.js";
import Models from "../models/models.js";

// POST /api/active-model — admin sets active model
export const setActiveModel = async (req, res) => {
  try {
    const { type, modelId } = req.body;

    if (!type || !modelId) {
      return res.status(400).json({
        success: false,
        message: "type and modelId are required",
      });
    }

    const model = await Models.findById(modelId);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    // upsert — always one doc per type
    const active = await ActiveModel.findOneAndUpdate(
      { type },
      {
        type,
        modelId: model._id,
        model_name: model.model_name,
        provider:   model.provider,
        link:       model.link,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Active ${type} model set successfully`,
      data: active,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET /api/active-model/:type — fetch active model by type
export const getActiveModel = async (req, res) => {
  try {
    const { type } = req.params;

    const active = await ActiveModel.findOne({ type });
    if (!active) {
      return res.status(404).json({
        success: false,
        message: `No active ${type} model set`,
      });
    }

    return res.status(200).json({
      success: true,
      data: active,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};