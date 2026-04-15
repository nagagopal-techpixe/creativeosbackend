// models/imageLoader.js
import mongoose from "mongoose";

const imageLoaderSchema = new mongoose.Schema({
  url: String,
  userId: String, // optional
}, { timestamps: true });

export default mongoose.model("ImageLoader", imageLoaderSchema);