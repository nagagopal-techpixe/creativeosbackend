import mongoose from "mongoose";

const activeModelSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true, // one active model per type e.g. "image", "video", "voice"
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Models",
    required: true,
  },
  model_name: { type: String, required: true },
  provider:   { type: String, required: true },
  link:       { type: String, required: true },
}, { timestamps: true });

const ActiveModel = mongoose.model("ActiveModel", activeModelSchema);
export default ActiveModel;