import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  icon:  String,
  name:  String,
  base:  String,
  desc:  String,
  tag:   String,
  val:   String,
  label: String,
  w:     String,
  h:     String,
  dim:   String,
  isActive: { type: Boolean, default: true }
}, { _id: true });

const groupSchema = new mongoose.Schema({
  title: String,
  group: String,
  opts:  [itemSchema],
  isActive: { type: Boolean, default: true }
}, { _id: true });

const storyboardPresetSchema = new mongoose.Schema({
  name:  String,
  icon:  String,
  state: { type: Object },
  isActive: { type: Boolean, default: true }
}, { _id: true });

const storyboardBuilderSchema = new mongoose.Schema({
  types: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  styles: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  frames: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  ratios: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  details: {
    items:    [groupSchema],
    isActive: { type: Boolean, default: true }
  },
  presets: {
    items:    [storyboardPresetSchema],
    isActive: { type: Boolean, default: true }
  }
});

export default mongoose.models.StoryboardBuilder ||
  mongoose.model("StoryboardBuilder", storyboardBuilderSchema);