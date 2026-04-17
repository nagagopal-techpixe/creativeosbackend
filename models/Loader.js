import mongoose from "mongoose";

const loaderSchema = new mongoose.Schema({
  url:       { type: String, required: true },
  type:      { type: String, enum: ["image", "video", "audio"], required: true },
  filename:  { type: String },
  mimetype:  { type: String },
  size:      { type: Number },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // ← add this
}, { timestamps: true });

// fast lookup: all loaders for a project
loaderSchema.index({ projectId: 1 });

export default mongoose.model("Loader", loaderSchema);