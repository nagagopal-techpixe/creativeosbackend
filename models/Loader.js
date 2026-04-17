import mongoose from "mongoose";

<<<<<<< HEAD
const imageLoaderSchema = new mongoose.Schema({
  url: String,
 userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
=======
const loaderSchema = new mongoose.Schema({
  url:       { type: String, required: true },
  type:      { type: String, enum: ["image", "video", "audio"], required: true },
  filename:  { type: String },
  mimetype:  { type: String },
  size:      { type: Number },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // ← add this
>>>>>>> 449d9d72bc39e25d37b2d67abf6e84ba4e39aca0
}, { timestamps: true });

// fast lookup: all loaders for a project
loaderSchema.index({ projectId: 1 });

export default mongoose.model("Loader", loaderSchema);