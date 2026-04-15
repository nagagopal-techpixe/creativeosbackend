// models/imageLoader.js
import mongoose from "mongoose";

const imageLoaderSchema = new mongoose.Schema({
  url: String,
 userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("ImageLoader", imageLoaderSchema);