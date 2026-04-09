// models/UserModel/User.js
import mongoose from "mongoose";

const sectionPermSchema = new mongoose.Schema({
  isActive:     { type: Boolean, default: true },
  allowedItems: [{ type: mongoose.Schema.Types.ObjectId }],
}, { _id: false });

const detailsPermSchema = {
  isActive:      { type: Boolean, default: true },
  allowedGroups: [{ type: mongoose.Schema.Types.ObjectId }],
  allowedOpts:   { type: mongoose.Schema.Types.Mixed, default: {} },
};

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, default: "user" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },

  permissions: {

    videoBuilder: {
      types:     { type: sectionPermSchema, default: () => ({}) },
      styles:    { type: sectionPermSchema, default: () => ({}) },
      durations: { type: sectionPermSchema, default: () => ({}) },
      formats:   { type: sectionPermSchema, default: () => ({}) },
      hooks:     { type: sectionPermSchema, default: () => ({}) },
      presets:   { type: sectionPermSchema, default: () => ({}) },
      details:   detailsPermSchema,
    },

    voiceBuilder: {
      types:  { type: sectionPermSchema, default: () => ({}) },
      tones:  { type: sectionPermSchema, default: () => ({}) },
      pacing: { type: sectionPermSchema, default: () => ({}) },
    },

    //  matches CharacterBuilder model exactly: types, styles, poses, presets, details
    characterBuilder: {
      types:   { type: sectionPermSchema, default: () => ({}) },
      styles:  { type: sectionPermSchema, default: () => ({}) },
      poses:   { type: sectionPermSchema, default: () => ({}) },  //  poses not durations/formats/hooks
      presets: { type: sectionPermSchema, default: () => ({}) },
      details: detailsPermSchema,
    },
    musicBuilder: {
  types:     { type: sectionPermSchema, default: () => ({}) },
  genres:    { type: sectionPermSchema, default: () => ({}) },
  durations: { type: sectionPermSchema, default: () => ({}) },
  presets:   { type: sectionPermSchema, default: () => ({}) },
  details:   detailsPermSchema,
},
storyboardBuilder: {
  types:   { type: sectionPermSchema, default: () => ({}) },
  styles:  { type: sectionPermSchema, default: () => ({}) },
  frames:  { type: sectionPermSchema, default: () => ({}) },
  ratios:  { type: sectionPermSchema, default: () => ({}) },
  presets: { type: sectionPermSchema, default: () => ({}) },
  details: detailsPermSchema,
},
// models/UserModel/User.js — add inside permissions
imageBuilder: {
  tabs:              { type: sectionPermSchema, default: () => ({}) },
   categories:        detailsPermSchema,
  recentGenerations: { type: sectionPermSchema, default: () => ({}) },
  types:             { type: sectionPermSchema, default: () => ({}) },
  styles:            { type: sectionPermSchema, default: () => ({}) },
  ratios:            { type: sectionPermSchema, default: () => ({}) },
  presets:           { type: sectionPermSchema, default: () => ({}) },
  details:           detailsPermSchema,
},
navItems: {
  isActive:     { type: Boolean, default: true },
  allowedItems: [{ type: mongoose.Schema.Types.ObjectId }],
},

  },
}, { timestamps: true });

// Prevent model overwrite error
export default mongoose.models.User || mongoose.model("User", userSchema);