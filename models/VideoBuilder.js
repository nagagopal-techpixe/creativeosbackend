import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  icon: String,
  name: String,
  base: String,
  desc: String,
  tag: String,
  val: String,
  label: String,
  unit: String,
  use: String,
  w: String,
  h: String,

  isActive: { type: Boolean, default: true } // 🔥 item-level toggle
}, { _id: true }); // keeps auto _id

const groupSchema = new mongoose.Schema({
  title: String,
  group: String,
  opts: [itemSchema],

  isActive: { type: Boolean, default: true } // 🔥 group-level toggle
}, { _id: true });

const videoBuilderSchema = new mongoose.Schema({
  types: {
    items: [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  styles: {
    items: [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  details: {
    items: [groupSchema],
    isActive: { type: Boolean, default: true }
  },
  durations: {
    items: [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  formats: {
    items: [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  hooks: {
    items: [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  presets: {
    items: Array,
    isActive: { type: Boolean, default: true }
  }
});

export default mongoose.models.VideoBuilder ||
  mongoose.model("VideoBuilder", videoBuilderSchema);