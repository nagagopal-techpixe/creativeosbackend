import mongoose from "mongoose";

const AttachedFileSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    mimeType:     { type: String, required: true },
    fileType:     { type: String, enum: ["image", "video", "audio"], required: true },
    s3Url:        { type: String, required: true },
    sizeBytes:    { type: Number },
  },
  { _id: false }
);

const GenerationSchema = new mongoose.Schema(
  {
    prompt:        { type: String, trim: true, maxlength: 4000 },
    category:      { type: String, default: "" },
    attachedFiles: [AttachedFileSchema],
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    output:        { type: String, default: null },
  },
  { timestamps: true, versionKey: false }
);

const Generation = mongoose.model("Generation", GenerationSchema);
export default Generation;