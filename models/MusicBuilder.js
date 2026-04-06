import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  icon:  String,
  name:  String,
  base:  String,
  desc:  String,
  tag:   String,
  val:   String,
  label: String,
  unit:  String,
  isActive: { type: Boolean, default: true }
}, { _id: true });

const groupSchema = new mongoose.Schema({
  title: String,
  group: String,
  opts:  [itemSchema],
  isActive: { type: Boolean, default: true }
}, { _id: true });

const musicBuilderSchema = new mongoose.Schema({
  types: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  genres: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  details: {
    items:    [groupSchema],
    isActive: { type: Boolean, default: true }
  },
  durations: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  presets: {
    items:    { type: Array, default: [] },
    isActive: { type: Boolean, default: true }
  }
});

export default mongoose.models.MusicBuilder ||
  mongoose.model("MusicBuilder", musicBuilderSchema);