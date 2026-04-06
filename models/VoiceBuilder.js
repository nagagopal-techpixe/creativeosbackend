import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  icon:  String,
  name:  String,
  base:  String,
  desc:  String,
  tag:   String,
  val:   String,
  label: String,
  isActive: { type: Boolean, default: true }
}, { _id: true });

const voiceBuilderSchema = new mongoose.Schema({
  types: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  tones: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  pacing: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  presets: {
    items:    { type: Array, default: [] },
    isActive: { type: Boolean, default: true }
  }
});

export default mongoose.models.VoiceBuilder ||
  mongoose.model("VoiceBuilder", voiceBuilderSchema);