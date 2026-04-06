import mongoose from "mongoose";

const navItemSchema = new mongoose.Schema({
  id:       String,  // 'images' | 'videos' | 'voice' | 'music' | 'characters'
  label:    String,
  icon:     String,  // Lucide icon name as string
  color:    String,
  path:     String,
  isActive: { type: Boolean, default: true }
}, { _id: true });

const navConfigSchema = new mongoose.Schema({
  navItems: [navItemSchema]
});

export default mongoose.models.NavConfig ||
  mongoose.model("NavConfig", navConfigSchema);