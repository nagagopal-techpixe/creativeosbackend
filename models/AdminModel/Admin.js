// models/AdminModel/Admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name:                    { type: String, required: true },
  email:                   { type: String, required: true, unique: true },
  password:                { type: String, required: true },
  role:                    { type: String, default: "admin" },
  resetPasswordToken:      { type: String },
  resetPasswordExpire:     { type: Date },
},{ timestamps: true });

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);