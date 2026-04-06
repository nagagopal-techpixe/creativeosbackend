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
  w:     String,
  h:     String,
  dim:   String,
  isActive: { type: Boolean, default: true }
}, { _id: true });

const groupSchema = new mongoose.Schema({
  title:    String,
  group:    String,
  opts:     [itemSchema],
  isActive: { type: Boolean, default: true }
}, { _id: true });

const characterBuilderSchema = new mongoose.Schema({
  types: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  styles: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  details: {
    items:    [groupSchema],
    isActive: { type: Boolean, default: true }
  },
  poses: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  presets: {
    items:    { type: Array, default: [] },
    isActive: { type: Boolean, default: true }
  }
});

export default mongoose.models.CharacterBuilder ||
  mongoose.model("CharacterBuilder", characterBuilderSchema);