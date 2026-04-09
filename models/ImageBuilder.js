import mongoose from "mongoose";  // was missing

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

const categoryItemSchema = new mongoose.Schema({
  name:     String,
  full:     String,
  desc:     String,
  icon:     String,
  count:    Number,
  color:    String,
  isActive: { type: Boolean, default: true }
}, { _id: true });

const categoryGroupSchema = new mongoose.Schema({
  id:       String,
  items:    [categoryItemSchema],
  isActive: { type: Boolean, default: true }
}, { _id: true });

const tabSchema = new mongoose.Schema({
  id:       String,
  label:    String,
  color:    String,
  isActive: { type: Boolean, default: true }
}, { _id: true });

const recentGenerationSchema = new mongoose.Schema({
  name:     String,
  type:     String,
  time:     String,
  emoji:    String,
  color:    String,
  isActive: { type: Boolean, default: true }
}, { _id: true });

const imageBuilderSchema = new mongoose.Schema({
  tabs: {
    items:    [tabSchema],
    isActive: { type: Boolean, default: true }
  },
  categories: {
    items:    [categoryGroupSchema],
    isActive: { type: Boolean, default: true }
  },
  recentGenerations: {
    items:    [recentGenerationSchema],
    isActive: { type: Boolean, default: true }
  },
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
  ratios: {
    items:    [itemSchema],
    isActive: { type: Boolean, default: true }
  },
  presets: {
    items:    { type: Array, default: [] },
    isActive: { type: Boolean, default: true }
  }
});

export default mongoose.models.ImageBuilder ||
  mongoose.model("ImageBuilder", imageBuilderSchema);